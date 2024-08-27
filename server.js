import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

import AuthService from './custom_modules/Auth.js';
import JWT from './custom_modules/JWT.js';
import WebSocketServer from './custom_modules/WebSocketServer.js';
import RateLimiter from './custom_modules/RateLimit.js';

import { getSplashPage, getCopyPastePage, getLoginPage } from './MVC/Controllers/webpageController.js';
import { authenticateLogin } from './MVC/Controllers/authController.js';
import { generateGetJWT, generatePostJWT } from './MVC/Controllers/jwtController.js';
import { upgradeWebSocket } from './MVC/Controllers/webSocketController.js';

import backupDatabase from './utilities/backupDatabase.js';

const app = express();
app.use(express.json());

// Serve static files
const __filename = fileURLToPath(import.meta.url); // Convert the current module's URL to a file path
const __dirname = path.dirname(__filename); // Get the directory name of the current module
app.use(express.static(path.join(__dirname, 'public','v2'))); // used to serve static file (HTML, CSS, JS)

// Setup Rate Limiting
const rateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 requests per minute
});

// Rate limiting middleware
app.use(rateLimiter.rateLimit());

const server = http.createServer(app);
const jwt = new JWT();

// Initialize WebSocket Server
const webSocketServer = new WebSocketServer(server, jwt);
const wss = webSocketServer.wss;


// Routes
app.get('/', getSplashPage);
app.get('/copy-paste', getCopyPastePage);
app.get('/login', getLoginPage);
app.get('/dashboard', AuthService.authenticateToken, (req, res) => {
    try {
        res.send('This serves the private authenticated admin dashboard');
    } catch (error) {
        console.error('Error serving dashboard: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
app.post('/api/auth', authenticateLogin);
app.get('/api/secure', (req, res) => generateGetJWT(req, res, jwt));
app.post('/api/secure', (req, res) => generatePostJWT(req, res, jwt));
app.get('/api/wss', (req, res) => upgradeWebSocket(req, res, wss));

// Start the server
const PORT = process.env.PORT;
server.listen(PORT,'0.0.0.0', () => {
    
    console.log(`Server is running on http://localhost:${PORT}`);

    // Schedule the database backup every hour (3600000 ms)
    setInterval(() => {backupDatabase()}, 3600000);
});


