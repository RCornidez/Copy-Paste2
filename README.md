
<h1>Copy/Paste 📋</h1>


**Copy-Paste v2** is an improved version of a WebRTC-based peer-to-peer text and file-sharing application. This update enhances functionality and performance while streamlining the codebase and user experience.

<p><a href="https://copy.cornidez.com/" target="_blank">Demo</a></p>
<p><a href="https://copy.cornidez.com/quickstart" target="_blank">Quickstart guide</a></p>
<p><a href="https://copy.cornidez.com/overview" target="_blank">Project overview</a></p>
<p><a href="https://copy.cornidez.com/privacy" target="_blank">Privacy Policy</a></p>


## Features

- **Modular Code:** Refactored for cleaner and more maintainable code.
- **WebSocket Connection Handling:** Replaces long-polling with efficient WebSocket connections for real-time communication.
- **Multifile Sending:** Enables sending multiple files per message, expanding beyond the previous single-file limitation.
- **SQLite Database Update:** Switched from Firebase to SQLite, eliminating third-party dependencies and improving data management.
- **Shorter Session IDs:** Introduced shorter session IDs for easier sharing across devices.
- **Authentication for Private Analytics Dashboard:** Added a feature to monitor key metrics through a private analytics dashboard.
- **Rate Limiting:** Implemented to track and block abusive robot access.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Express
- **Database:** SQLite
- **Build Tools:** Esbuild, Terser
- **Protocols:** WebSocket, WebRTC
- **Authentication:** JWT

## How to run locally:

<ol>
    <li>Download <a href="https://github.com/RCornidez/Copy-Paste2">Github</a> repository.</li>
    <li>Run: `npm install` within the root of directory to install dependencies.</li>
    <li>Create a <a href="#env">.env file per the notes below.</a></li>
    <li>Run: `npm start` to run the demo</li>
    <li>Access via the IP Address and Port set within the .env file</li>
</ol>
<hr/>

## Directory Tree</h3>

```
.
├── LICENSE
├── MVC
│   ├── Controllers
│   │   ├── authController.js
│   │   ├── jwtController.js
│   │   ├── webSocketController.js
│   │   └── webpageController.js
│   ├── Models
│   │   ├── AllowedIPModel.js
│   │   ├── BlockedIPModel.js
│   │   ├── DatabaseContext.js
│   │   └── UserModel.js
│   └── Views
│       ├── assets
│       │   ├── access-file.png
│       │   ├── access-text.png
│       │   ├── arrowIcon.svg
│       │   ├── attachIcon.svg
│       │   ├── chainIcon.svg
│       │   ├── copyPasteLogo.svg
│       │   ├── create-space.png
│       │   ├── exit-space.png
│       │   ├── exitIcon.svg
│       │   ├── filesIcon.svg
│       │   ├── hamburgerMenuIcon.svg
│       │   ├── how-it-works.png
│       │   ├── join-space.png
│       │   ├── logo.svg
│       │   ├── send-file.png
│       │   ├── send-text.png
│       │   ├── sendIcon.svg
│       │   ├── tileBackground.svg
│       │   └── watchIcon.svg
│       ├── modules
│       │   ├── ConnectionHandler.js
│       │   ├── Message.js
│       │   ├── UIHandler.js
│       │   ├── WebRTC.js
│       │   └── WebSocketClient.js
│       ├── pages
│       │   ├── copy-paste.html
│       │   ├── dashboard.html
│       │   ├── login.html
│       │   ├── overview.html
│       │   ├── privacy.html
│       │   ├── quickstart.html
│       │   └── splash.html
│       ├── scripts
│       │   ├── copy-paste.js
│       │   ├── overview.js
│       │   ├── privacy.js
│       │   ├── quickstart.js
│       │   └── splash.js
│       └── styles
│           ├── copy-paste.css
│           ├── message.css
│           ├── overview.css
│           ├── privacy.css
│           ├── quickstart.css
│           └── splash.css
├── README.md
├── custom_modules
│   ├── Auth.js
│   ├── JWT.js
│   ├── RateLimit.js
│   ├── UTM.js
│   ├── WebSocketServer.js
│   └── v1
│       ├── firestore.js
│       └── webpages.js
├── database.db
├── package-lock.json
├── package.json
├── public
│   ├── v1
│   │   ├── public
│   │   │   ├── WebRTC_Logo.svg
│   │   │   ├── container.js
│   │   │   ├── index.css
│   │   │   ├── index.js
│   │   │   ├── overview.html
│   │   │   ├── privacy.html
│   │   │   └── quickstart.html
│   │   └── v1.html
│   └── v2 (Created when bundled - "npm start")
│       
├── server.js
└── utilities
    ├── backupDatabase.js
    ├── bundle.js
    ├── compress-mangle.js
    └── create-admin.js

```

<h3 id="env">Environment Variables (.env) file:</h3>
Assign the following values within the .env file. You can omit the Firestore details that is only for the v1 demo that I included.


```

# Copy/Paste v1 Variables
AUTH_SECRET_KEY="random generated string"
DATABASE="./database.db"
IP=127.0.0.1
PORT=5000


# Firestore API details
APIKEY=BIzaSyCDnusjr9l9m_DYzy0jJnL52TBI-QrrT10
AUTHDOMAIN=ready-1012f.firebaseapp.com
PROJECTID=copy-1035f
STORAGEBUCKET=paste-1032f.appspot.com
MESSAGINGSENDERID=80469571241
APPID=1:80179552041:web:f23e742643389a58ddff38

```
<hr/>