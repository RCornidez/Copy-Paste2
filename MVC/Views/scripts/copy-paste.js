import { ConnectionHandler } from "../modules/ConnectionHandler.js";

document.addEventListener('DOMContentLoaded', function() {

    const connectionHandler = new ConnectionHandler();

    const textarea = document.getElementById('message');

    let fileArray;
    const chat = document.getElementById('chat');
    let send = document.getElementById("send");

    // Exit Session
    const leaveButton = document.getElementById('exit');
    leaveButton.addEventListener('click', () => {
        window.location.href = '/';
    });


    // Adjust textarea height automatically
    function adjustChatHeight() {
        textarea.style.height = '70px'; 
        const newHeight = Math.max(textarea.scrollHeight, 70);
        chat.style.height = `${newHeight}px`;
        textarea.style.height = `${newHeight}px`;
    }
    textarea.addEventListener('input', adjustChatHeight);

    // Attach files
    attach.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
    
        fileInput.addEventListener('change', () => {
            fileArray = Array.from(fileInput.files);
        });
    
        fileInput.click(); // Trigger the file input dialog
    });

    // Send message
    send.addEventListener('click', () => {
        const message = textarea.value.trim();

        connectionHandler.sendMessage(message, fileArray);

        textarea.value = ''; 
        chat.style.height = '70px'; 
        textarea.style.height = '70px'; 
        fileArray = [];
        
    });

    // Grab session id if available
    try {
        const sessionParam = new URLSearchParams(window.location.search);
        const sessionId = sessionParam.get('session')
        console.log(sessionId);

        if ( sessionId ) {
            // join session and exit
            connectionHandler.joinCall(sessionId);
            //return;
        } else {
            // otherwise create a session
            connectionHandler.createCall()
        }

    } catch (error) {
        console.log(`There was an error when creating or joining a call: ${error}`)
    }

});