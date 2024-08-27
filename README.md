# Copy-Paste v2

## Overview

**Copy-Paste v2** is an improved version of a WebRTC-based peer-to-peer text and file-sharing application. This update enhances functionality and performance while streamlining the codebase and user experience.

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

## Notes

The project is currently pending UI updates. A demo will be provided once these changes are complete. 

Feel free to explore the GitHub repository for the latest updates and code.


---

Thank you for checking out Copy-Paste v2!

