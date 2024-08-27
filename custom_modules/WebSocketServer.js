import { WebSocketServer as webSocketServer } from 'ws';
import WebSocket from 'ws';


export default class WebSocketServer {
  constructor(server, jwt) {
    this.wss = new webSocketServer({ server });
    this.groups = {};
    this.jwt = jwt;
    this.connections = [];

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(ws, req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`${ip} connected to WebSocket`);

    const cookie = req.headers.cookie;
    const token = cookie.split('; ').find((c) => c.startsWith('jwt='));
    const tokenValue = token.split('=')[1];

    let decodedPayload;
    try {
      decodedPayload = this.jwt.verifyToken(tokenValue);
    } catch (error) {
      ws.send('Invalid JWT token');
      ws.close();
      console.error(`Invalid JWT token: ${token}`);
      return;
    }

    this.connections.push(ws);

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { group_id } = decodedPayload;
        console.log(`Received message type: ${parsedMessage.type}`);

        switch (parsedMessage.type) {
          case 'create':
            if (!this.groups[group_id]) {
              this.groups[group_id] = [];
            }
            this.groups[group_id].push(ws);
            console.log(`WebSocket client (${req.ip}) created group ${group_id}`);
            break;

          case 'join':
            if (!this.groups[group_id]) {
              console.log(`Invalid group Id: ${group_id}`);
              ws.close();
              break;
            }
            this.groups[group_id].push(ws);
            console.log(`WebSocket client (${req.ip}) joined group ${group_id}`);
            this.groups[group_id].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'group-message', content: { type: 'peer-joined', data: null } }));
              }
            });
            break;

          case 'close-group':
            this.groups[group_id].forEach(async (client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                await client.send(JSON.stringify({ type: 'group-message', content: 'closing group' }));
                await client.close();
              }
            });
            delete this.groups[group_id];
            break;

          case 'group-message':
            this.groups[group_id].forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'group-message', content: parsedMessage.content }));
              }
            });
            break;

          default:
            console.error(`Unhandled message type: ${parsedMessage.type}`);
            break;
        }
      } catch (error) {
        console.error(`Error handling WebSocket message: ${error}`);
        ws.send(JSON.stringify({ success: false }));
      }
    });

    ws.on('close', () => {
      this.connections = this.connections.filter(conn => conn !== ws);
    });
  }

  getConnectionCount() {
    return this.connections.length;
  }
}
