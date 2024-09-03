import { customAlphabet } from 'nanoid';

import WebRTCClient from './WebRTC.js';
import WebSocketClient from './WebSocketClient.js'
import { MetadataMessage, TextMessage, FileMessage } from './Message.js';
import { UIHandler } from './UIHandler.js';


export class ConnectionHandler {
    constructor() {
        this.wsClient = null;
        this.pc = null;
        this.isConnected = false;
        this.peerJoined = false;
        this.acknowledgmentResolvers = {};

        this.nanoid = customAlphabet('0123456789', 4);
        this.uiHandler = new UIHandler();
        this.connectionStatusElement = document.getElementById('message');

    }

    async createCall() {
        try {
            this.updateConnectionStatus('connecting...');

            console.log('Requesting secure token...');
            const response = await fetch('/api/secure');
            const data = await response.json();
            document.getElementById('session-id').innerText = `Space ID: ${data.group_id}`;
            console.log('Received secure token:', data);

            this.pc = new WebRTCClient();
            this.pc.messageHandler = this.handleMessage.bind(this);
            this.pc.setOnIceCandidateCallback(async (candidate) => {
                console.log('Sending ICE candidate:', candidate);
                await this.wsClient.sendMessage({
                    type: 'group-message',
                    content: { type: 'candidate', data: candidate }
                });
            });

            this.wsClient = new WebSocketClient('/api/wss', this.pc);
            this.pc.wsClient = this.wsClient;
            await this.wsClient.connectionPromise; // Wait for WebSocket connection

            console.log('WebSocket connection established, creating group...');
            await this.wsClient.sendMessage({ type: 'create', content: data.group_id });



            await this._waitForPeerToJoin();

            const offer = await this.pc.createOffer();
            console.log('Sending offer:', offer);

            await this.wsClient.sendMessage({
                type: 'group-message',
                content: { type: 'offer', data: offer }
            });

            // Log ICE connection state changes
            this.pc.pc.oniceconnectionstatechange = () => {
                const state = this.pc.pc.iceConnectionState;
                console.log('ICE connection state:', state);
                this.updateConnectionStatus(state);
                if (state === 'connected') {
                    console.log('Peer-to-peer connection established');
                    this.wsClient.sendMessage({
                        type: 'close-group',
                        content: null
                    });
                }
            };

        } catch (error) {
            console.error('Error in getSecureToken:', error);
            this.updateConnectionStatus('error');
        }
    }

    async joinCall(sessionId) {
        try {
            this.updateConnectionStatus('connecting...');
            const groupId = sessionId;
            console.log('Posting secure token for group ID:', groupId);
            const response = await fetch('/api/secure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ group_id: groupId })
            });
            const data = await response.json();
            document.getElementById('session-id').innerText = `Group ID: ${data.group_id}`;
            console.log('Received response for secure token:', data);

            this.pc = new WebRTCClient();
            this.pc.messageHandler = this.handleMessage.bind(this);
            this.pc.setOnIceCandidateCallback(async (candidate) => {
                console.log('Sending ICE candidate:', candidate);
                await this.wsClient.sendMessage({
                    type: 'group-message',
                    content: { type: 'candidate', data: candidate }
                });
            });

            this.pc.pc.oniceconnectionstatechange = () => {
                const state = this.pc.pc.iceConnectionState;
                console.log('ICE connection state:', state);
                this.updateConnectionStatus(state);
            };

            this.wsClient = new WebSocketClient('/api/wss', this.pc);
            await this.wsClient.connectionPromise; // Wait for WebSocket connection

            console.log('WebSocket connection established, joining group...');
            await this.wsClient.sendMessage({ type: 'join', content: data.group_id });



        } catch (error) {
            console.error('Error in postSecureToken:', error);
            this.updateConnectionStatus('error');
        }
    }

    async _waitForPeerToJoin() {
        console.log('Waiting for peer to join...');
        while (!this.wsClient.peerJoined) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('Peer has joined');
    }

    close() {
        if (this.wsClient) {
            this.wsClient.close();
            console.log('WebSocket connection closed explicitly');
        }
    }

    handleMessage(data) {
        try {

            if (typeof data !== 'string') {
                // Handle binary data as a file chunk
                this.handleFileChunk(new Uint8Array(data));
                return;
            }

            const message = JSON.parse(data);
            if (message.type === 'metadata') {
                // Store the file metadata to map incoming file chunks
                this.fileMetadata = message.files.reduce((map, file) => {
                    map[file.fileId] = {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        receivedSize: 0,
                        chunks: []
                    };
                    return map;
                }, {});

                this.sendAcknowledgment(message.messageId);
            } else if (message.type === 'ack') {
                // Resolve the promise when acknowledgment is received
                if (this.acknowledgmentResolvers[message.messageId]) {
                    this.acknowledgmentResolvers[message.messageId]();
                    delete this.acknowledgmentResolvers[message.messageId];
                }
            } else if (message.type === 'text') {
                this.displayReceivedMessage(message.content);
            } 

        } catch (e) {
            console.error('Error parsing message:', e);
        }
    }

    sendTextMessage(id, content) {
        console.log(`sending text ${content}`)
        const message = new TextMessage(id, content);
        this.pc.sendData(message.toJSON());
        this.uiHandler.createMessage(content, 'outgoing');
    }

    sendFiles(files, fileMetadataList) {
        fileMetadataList.forEach((fileMeta, index) => {
            
            const file = files[index];
            console.log(`sending file ${file.id}`)
            const fileMessage = new FileMessage(fileMeta.fileId, file);
            fileMessage.send(this.pc.dataChannel);
            const fileLinkElement = this.uiHandler.createFileLink(fileMeta, 'outgoing');
            
        });
    }
    
    async sendMessage(textContent, files) {
        const messageId = 'm' + this.nanoid();
        let textId = null;

        if (textContent) {
            textId = 't' + this.nanoid();
        }

        // Send Metadata first
        const metadataMessage = new MetadataMessage(messageId, textId, files);
        const fileMetadataList = metadataMessage.files;
        this.pc.sendData(metadataMessage.toJSON());
    
        // Wait for acknowledgment from the peer before sending text and files
        await this._waitForAcknowledgment(messageId);
    
        if (textContent) {
            this.sendTextMessage(textId, textContent);
        }
    
        if (files && files.length > 0) {
            this.sendFiles(files, fileMetadataList);
        }
    }

    sendAcknowledgment(messageId) {
        const acknowledgment = {
            type: 'ack',
            messageId: messageId
        };
        this.pc.sendData(JSON.stringify(acknowledgment));
    }

    _waitForAcknowledgment(messageId) {
        return new Promise((resolve) => {
            this.acknowledgmentResolvers[messageId] = resolve;
        });
    }

    displayReceivedMessage(content) {
        this.uiHandler.createMessage(content, 'incoming');
    }

    handleFileChunk(chunk) {
        try {
            const idLength = 5;
            const messageIdBuffer = chunk.slice(0, idLength);
            const fileChunk = chunk.slice(idLength);
    
            const textDecoder = new TextDecoder();
            const fileId = textDecoder.decode(messageIdBuffer).trim();

            console.log(fileId)
            console.log(fileChunk)

            if (fileId && this.fileMetadata[fileId]) {
                this.fileMetadata[fileId].chunks.push(fileChunk);
                this.fileMetadata[fileId].receivedSize += fileChunk.byteLength;
    
                console.log(`Received chunk for fileId ${fileId}, chunk size: ${fileChunk.byteLength}`);
                console.log(`FileId ${fileId} - Received Size: ${this.fileMetadata[fileId].receivedSize}, Expected Size: ${this.fileMetadata[fileId].size}`);
    
                if (this.fileMetadata[fileId].receivedSize === this.fileMetadata[fileId].size) {
                    this._assembleFile(fileId);
                }
            } else {
                console.error('Unknown fileId or no fileId found for incoming file chunk:', fileId);
            }
        } catch (e) {
            console.error('Error handling file chunk:', e);
        }
    }
    
    
    _assembleFile(fileId) {
        const fileData = this.fileMetadata[fileId];
    
        // Create a link element to download the file
        const fileLinkElement = this.uiHandler.createFileLink(fileData, 'incoming');
    }
    

    updateConnectionStatus(status) {
        let phrase;

        switch (status) {
            case 'connected':
                phrase = "We're connected! 😁 Send something.."
                break;
            case 'connecting':
                phrase = "Hold on, trying to connect!"
                break;
            case 'disconnected':
                phrase = "Whoops, looks like we're disconnected 😞"
                break;
            default:
                phrase = "Initializing.."
                break;
        }
        this.connectionStatusElement.placeholder = phrase;
    }
}


