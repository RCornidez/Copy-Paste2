import { customAlphabet } from "nanoid";

class MetadataMessage {
    constructor(messageId, textId = null, files = []) {
        this.messageId = messageId;
        this.type = 'metadata';
        this.textId = textId;
        this.files = files.map(file => ({
            fileId: 'f' + customAlphabet('0123456789', 4)(),
            name: file.name,
            size: file.size,
            type: file.type
        }));
    }

    toJSON() {
        return JSON.stringify({
            messageId: this.messageId,
            type: this.type,
            textId: this.textId,
            files: this.files
        });
    }
}


class TextMessage {
    constructor(id, content) {
        this.type = 'text';
        this.id = id;
        this.content = content;
    }

    toJSON() {
        return JSON.stringify({
            type: this.type,
            id: this.id,
            content: this.content
        });
    }
}

class FileMessage {
    constructor(id, file) {
        this.id = id;
        this.file = file;
        this.chunkSize = 16384;
        this.offset = 0;
    }

    async send(dataChannel) {
        const reader = new FileReader();

        reader.onload = (event) => {
            // Prepend the message ID to the chunk
            const chunk = event.target.result;
            const messageIdBuffer = new TextEncoder().encode(this.id);
            const chunkWithId = new Uint8Array(messageIdBuffer.length + chunk.byteLength);

            chunkWithId.set(messageIdBuffer, 0);
            chunkWithId.set(new Uint8Array(chunk), messageIdBuffer.length);

            // Send the chunk with the message ID
            dataChannel.send(chunkWithId);

            console.log(`Sent chunk for fileId ${this.id}, chunk size: ${chunk.byteLength}`);

            this.offset += chunk.byteLength;

            if (this.offset < this.file.size) {
                this._readSlice(reader);
            } else {
                console.log(`Finished sending fileId ${this.id}`);
            }
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
        };

        this._readSlice(reader);
    }

    _readSlice(reader) {
        const slice = this.file.slice(this.offset, this.offset + this.chunkSize);
        reader.readAsArrayBuffer(slice);
    }
}


export {MetadataMessage, TextMessage, FileMessage};