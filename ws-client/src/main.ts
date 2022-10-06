import './style.css';
import { connectToServer } from './sockets/connect-to-server';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>WebSocket Client</h1>
    <span id="server-status">Offline</span>
  </div>
`;

connectToServer();
