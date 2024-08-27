export default class WebSocketClient {
    constructor(serverUrl, peerConnection) {
        this.serverUrl = serverUrl;
        this.pc = peerConnection;
        this.websocket = null;
        this.isConnected = false;
        this.peerJoined = false;
        this.connectionPromise = this._connect();
    }

    _connect() {
        return new Promise((resolve, reject) => {
            try {
                this.websocket = new WebSocket(this.serverUrl);

                this.websocket.onopen = () => {
                    console.log('WebSocket connection established');
                    this.isConnected = true;
                    resolve();
                };

                this.websocket.onmessage = async (event) => {
                    console.log('WebSocket message received:', event.data);
                    const message = JSON.parse(event.data);
                    await this._handleMessage(message);
                };

                this.websocket.onerror = (event) => {
                    console.error('WebSocket error observed:', event);
                    reject(event);
                };

                this.websocket.onclose = (event) => {
                    console.log('WebSocket connection closed');
                    this.isConnected = false;
                };
            } catch (error) {
                console.error('Exception occurred during WebSocket connection:', error);
                reject(error);
            }
        });
    }

    async _handleMessage(message) {
        console.log('Handling WebSocket message:', message);

        

        switch (message.content.type) {
            case 'offer':
                console.log('Handling offer message');
                const answer = await this.pc.handleOffer(message.content.data);
                console.log('Sending answer:', answer);

                this.sendMessage({
                    type: 'group-message',
                    content: { type: 'answer', data: answer }
                });
                break;
            case 'answer':
                console.log('Handling answer message');
                await this.pc.handleAnswer(message.content.data);
                break;
            case 'candidate':
                console.log('Handling ICE candidate message');
                await this.pc.handleIceCandidate(message.content.data);
                break;
            case 'peer-joined':
                console.log('Peer joined message received');
                this.peerJoined = true;
                break;
            default:
                console.warn('Unhandled message type:', message.content.type);
                break;
        }
    }

    async sendMessage(messageObject) {
        await this.connectionPromise; // Ensure the connection is open
        if (this.websocket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify(messageObject);
            this.websocket.send(message);
            console.log('Sent message:', message);
        } else {
            console.error('WebSocket connection is not open. Failed to send message:', messageObject);
        }
    }

    close() {
        if (this.websocket) {
            this.websocket.close();
            console.log('WebSocket connection closed explicitly');
        }
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    clearCookies() {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        });
        console.log('Cookies cleared');
    }

}