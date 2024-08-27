import { ConnectionHandler } from "../modules/ConnectionHandler.js";




function setBackground() {
    const backgroundOptions = [1, 2, 3, 4, 5];
    const randomBackgroundIndex = Math.floor(Math.random() * backgroundOptions.length);
    const backgroundSVG = backgroundOptions[randomBackgroundIndex] + '.svg';
    document.getElementsByTagName('body')[0].style.backgroundImage = `url('/assets/backgrounds/${backgroundSVG}')`;
}



document.addEventListener('DOMContentLoaded', () => {
    setBackground();

    let container = document.getElementById("container");
    let attach = document.getElementById("attach");
    let chat = document.getElementById("chat");
    let upload = document.getElementById("upload");
    const leaveButton = document.getElementById('leave-button');

    leaveButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    const connectionHandler = new ConnectionHandler();


    
    // Dynamically adjust the text input form height
    const textInput = document.getElementById('textInput');
    textInput.innerText = ''
    textInput.addEventListener('input', autoResize, false);

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }


    upload.addEventListener('click', () => {
        const message = textInput.value.trim();
        if (message) {
            connectionHandler.sendMessage(message, []); // Send text only
            textInput.value = ''; // Clear the text input
            autoResize.call(textInput);
        }
    });
    
    attach.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
    
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files);
            if (files.length > 0) {
                connectionHandler.sendMessage('', files); // Send files only
            }
        });
    
        fileInput.click(); // Trigger the file input dialog
    });
    

    // Grab session id if available
    try {
        const sessionParam = new URLSearchParams(window.location.search);
        const sessionId = sessionParam.get('session')
        console.log(sessionId);

        if ( sessionId ) {
            // join session and exit
            connectionHandler.joinCall(sessionId);
            return;
        }

        // otherwise create a session
        connectionHandler.createCall()

    } catch (error) {
        console.log(`There was an error when creating or joining a call: ${error}`)
    }

});

