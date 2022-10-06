import { Manager } from 'socket.io-client';
import { environment } from '../environment';
import { Socket } from 'socket.io-client';

const addListeners = (socket: Socket) => {
  const serverStatusSpan = document.getElementById('server-status')!;

  socket.on('connect', () => {
    serverStatusSpan.innerHTML = 'Online';
  });
  socket.on('disconnect', () => {
    serverStatusSpan.innerHTML = 'Offline';
  });
};

export const connectToServer = () => {
  const endpoint = `${environment.serverApi}/socket.io/socket.io.js`;
  const manager = new Manager(endpoint);

  const socket = manager.socket('/');
  addListeners(socket);
};
