
export default class WebRTCClient {
    constructor() {
        const servers = {
            iceServers: [
              { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
            ],
            iceCandidatePoolSize: 10,
          };
        this.pc = new RTCPeerConnection(servers);
        this.wsClient = null;
        this.dataChannel = null;
        this.iceCandidates = [];
        this.onIceCandidateCallback = null;
        this.messageHandler = null;

        // Set up ICE candidate event handler
        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.iceCandidates.push(event.candidate);
                console.log('ICE candidate collected:', event.candidate);
                if (this.onIceCandidateCallback) {
                    this.onIceCandidateCallback(event.candidate);
                }
            }
        };

        // Set up data channel event handler
        this.pc.ondatachannel = (event) => {
            console.log('Data channel created');
            this.dataChannel = event.channel;
            this.setupDataChannel();
        };

    }

    async createOffer() {
        try {
            // Create a data channel
            this.dataChannel = this.pc.createDataChannel('chat');
            this.setupDataChannel();
            console.log('Data channel created');

            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);
            console.log('Created offer:', offer);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    async handleOffer(offer) {
        try {
            console.log('Handling offer:', offer);
            await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            console.log('Created answer:', answer);
            return answer;
        } catch (error) {
            console.error('Error handling offer:', error);
            throw error;
        }
    }

    async handleAnswer(answer) {
        try {
            console.log('Handling answer:', answer);
            await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error('Error handling answer:', error);
            throw error;
        }
    }

    async handleIceCandidate(candidate) {
        try {
            console.log('Handling ICE candidate:', candidate);
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            throw error;
        }
    }

    setOnIceCandidateCallback(callback) {
        this.onIceCandidateCallback = callback;
    }

    setupDataChannel() {
        this.dataChannel.binaryType = 'arraybuffer';

        this.dataChannel.onopen = () => {
            console.log('Data channel is open');
        };

        this.dataChannel.onmessage = (message) => {
            console.log('Received message:', message);
            if (this.messageHandler) {
                this.messageHandler(message.data);
            } else {
                console.warn('No message handler set');
            }
        };

        this.dataChannel.onclose = () => {
            console.log('Data channel is closed');
        };

        this.dataChannel.onerror = (error) => {
            console.error('Data channel error:', error);
        };
    }

    addEventListener(event, callback) {
        if (this.dataChannel) {
            this.dataChannel.addEventListener(event, callback);
        }
    }

    removeEventListener(event, callback) {
        if (this.dataChannel) {
            this.dataChannel.removeEventListener(event, callback);
        }
    }

    sendData(data) {
        try {
            if (this.dataChannel && this.dataChannel.readyState === 'open') {
                console.log('Sending data:', data);
                this.dataChannel.send(data);
            } else {
                console.error('Data channel is not open or ready to send data');
            }
        } catch (error) {
            console.error('Error while sending data:', error);
        }
    }
    

}
