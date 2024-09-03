import { customAlphabet } from 'nanoid';

export class UIHandler {
    constructor() {
        this.nanoid = customAlphabet('1234567890', 4);
        this.colorArray = [
            { background: '#fef2f2', border: '#f87171' },
            { background: '#fff7ed', border: '#fb923c' },
            { background: '#fffbeb', border: '#fbbf24' },
            { background: '#fefce8', border: '#facc15' },
            { background: '#f7fee7', border: '#a3e635' },
            { background: '#ecfdf5', border: '#34d399' },
            { background: '#f0fdfa', border: '#2dd4bf' },
            { background: '#ecfeff', border: '#22d3ee' },
            { background: '#f0f9ff', border: '#38bdf8' },
            { background: '#eff6ff', border: '#60a5fa' },
            { background: '#eef2ff', border: '#818cf8' },
            { background: '#f5f3ff', border: '#a78bfa' },
            { background: '#faf5ff', border: '#c084fc' },
            { background: '#fdf2f8', border: '#f472b6' },
            { background: '#fff1f2', border: '#fb7185' }
        ];
    }

    createMessage(content, type) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';
        const message = document.createElement('div');
        message.className = 'message';
    
        // Position the message
        messageWrapper.style.alignItems = type === 'incoming' ? 'flex-start' : 'flex-end';
    
        // Add content to the message
        const textElement = document.createElement('p');
        textElement.innerHTML = content;
        textElement.className = 'message-text';
    
        // Add click event listener to copy text to clipboard
        textElement.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(content);
                console.log('Text copied to clipboard:', content);
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        });
    
        message.appendChild(textElement);
        messageWrapper.appendChild(message);
    
        // Apply random color scheme
        this.applyRandomColor(message);
    
        // Append to chat container
        const chatContainer = document.getElementById('container');
        chatContainer.appendChild(messageWrapper);
    }
    

    createFileLink(file, type) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';

        const message = document.createElement('div');
        message.className = 'message';
    
        // Position the message
        messageWrapper.style.alignItems = type === 'incoming' ? 'flex-start' : 'flex-end';

        const fileSection = document.createElement('div');
        fileSection.className = 'message';

        // Create a binary blob and URL
        let blob = new Blob(file.chunks, { type: file.type });
        let url = URL.createObjectURL(blob);
    
        // Determine icon based on file type
        let icon;
        if (file.type.startsWith('image/')) {
            icon = '📸';
        } else if (file.type.startsWith('audio/')) {
            icon = '🔊';
        } else if (file.type.startsWith('video/')) {
            icon = '📽️';
        } else if (file.type.startsWith('application/pdf')) {
            icon = '📄';
        } else {
            icon = '💾';
        }

        // Format file size
        let size = this.formatFileSize(file.size);
    
        // Create link element
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file.name;
        anchor.textContent = `${icon} ${file.name} (${size})`;
        anchor.style.textDecoration = 'none';
        anchor.style.display = 'block';

        // Apply random color scheme
        this.applyRandomColor(fileSection);
    
        // Append to the file section
        fileSection.appendChild(anchor);
        messageWrapper.appendChild(fileSection);

        // Append to chat container
        const chatContainer = document.getElementById('container');
        chatContainer.appendChild(messageWrapper);
    }

    formatFileSize(size) {
        if (size >= 1e9) {
            return (size / 1e9).toFixed(2) + ' GB';
        } else if (size >= 1e6) {
            return (size / 1e6).toFixed(2) + ' MB';
        } else if (size >= 1e3) {
            return (size / 1e3).toFixed(2) + ' KB';
        } else {
            return size + ' B';
        }
    }

    applyRandomColor(element) {
        const randomIndex = Math.floor(Math.random() * this.colorArray.length);
        const colorScheme = this.colorArray[randomIndex];
        element.style.backgroundColor = colorScheme.background;
        element.style.borderColor = colorScheme.border;
    }
}
