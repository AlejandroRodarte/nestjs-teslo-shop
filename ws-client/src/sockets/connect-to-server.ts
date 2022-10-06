import { Manager } from 'socket.io-client';
import { environment } from '../environment';
import { ClientSocket } from '../types/client-socket.type';
import { ServerToClientEvents } from '../interfaces/server-to-client-events.interface';
import { ClientToServerEvents } from '../interfaces/client-to-server-events.interface';
import * as ServerToClientEventNames from '../constants/server-to-client-event-names.constants';

const addListeners = (socket: ClientSocket) => {
  const serverStatusSpan = document.getElementById('server-status')!;
  const clientsUl = document.getElementById('clients-ul')!;

  socket.on('connect', () => {
    serverStatusSpan.innerHTML = 'Online';
  });
  socket.on('disconnect', () => {
    serverStatusSpan.innerHTML = 'Offline';
  });
  socket.on(ServerToClientEventNames.CLIENT_LIST_UPDATED, (data) => {
    let clientsHtml = '';
    data.clientIds.forEach((clientId) => {
      clientsHtml += `
        <li>${clientId}</li>
      `;
    });
    clientsUl.innerHTML = clientsHtml;
  });
};

export const connectToServer = () => {
  const endpoint = `${environment.serverApi}/socket.io/socket.io.js`;
  const manager = new Manager<ServerToClientEvents, ClientToServerEvents>(
    endpoint
  );
  const socket: ClientSocket = manager.socket('/');
  addListeners(socket);
};
