import './style.css';
import { connectToServer } from './sockets/connect-to-server';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>WebSocket Client</h2>
    <input id="jwt-token" placeholder="JWT" />
    <button id="btn-connect">Connect</button>
    <br/>
    <span id="server-status">Offline</span>
    <ul id="clients-ul"></ul>
    <form id="message-form">
      <input placeholder="message" id="message-input" />
    </form>
    <h3>Messages</h3>
    <ul id="messages-ul"></ul>
  </div>
`;

const jwtTokenInput = <HTMLInputElement>document.getElementById('jwt-token');
const connectButton = <HTMLButtonElement>document.getElementById('btn-connect');

connectButton.addEventListener('click', () => {
  const jwtToken = jwtTokenInput.value.trim();
  if (jwtToken.length <= 0) return alert('Enter a valid JWT');
  connectToServer(jwtToken);
});
