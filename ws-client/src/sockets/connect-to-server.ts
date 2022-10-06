import { Manager } from 'socket.io-client';
import { environment } from '../environment';

export const connectToServer = () => {
  const endpoint = `${environment.serverApi}/socket.io/socket.io.js`;
  const manager = new Manager(endpoint);

  const socket = manager.socket('/');
  socket
};
