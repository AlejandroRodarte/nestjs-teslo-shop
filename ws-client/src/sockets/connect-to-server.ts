import { Manager } from 'socket.io-client';
import { environment } from '../environment';
import { ClientSocket } from '../types/client-socket.type';
import { ServerToClientEvents } from '../interfaces/server-to-client-events.interface';
import { ClientToServerEvents } from '../interfaces/client-to-server-events.interface';
import * as ClientToServerEventNames from '../constants/client-to-server-event-names.constants';
import { ClientMessageSentDto } from '../dto/client-to-server/client-message-sent.dto';
import {
  ClientListUpdatedListener,
  ServerMessageSentListener,
} from '../classes';

const addListeners = (socket: ClientSocket) => {
  const serverStatusSpan = <HTMLSpanElement>(
    document.getElementById('server-status')!
  );
  const clientsUl = <HTMLUListElement>document.getElementById('clients-ul')!;
  const messageForm = <HTMLFormElement>document.getElementById('message-form')!;
  const messageInput = <HTMLInputElement>(
    document.getElementById('message-input')!
  );
  const messagesUl = <HTMLUListElement>document.getElementById('messages-ul')!;

  socket.on('connect', () => {
    serverStatusSpan.innerHTML = 'Online';
  });
  socket.on('disconnect', () => {
    serverStatusSpan.innerHTML = 'Disconnected';
  });

  new ClientListUpdatedListener(socket, { clientsUl }).subscribe();
  new ServerMessageSentListener(socket, { messagesUl }).subscribe();

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit(
      ClientToServerEventNames.CLIENT_MESSAGE_SENT,
      new ClientMessageSentDto('abc', messageInput.value)
    );

    messageInput.value = '';
  });
};

export const connectToServer = (jwtToken: string) => {
  const endpoint = `${environment.serverApi}/socket.io/socket.io.js`;
  const manager = new Manager<ServerToClientEvents, ClientToServerEvents>(
    endpoint,
    {
      extraHeaders: {
        authorization: jwtToken,
      },
    }
  );

  const socket: ClientSocket = manager.socket('/');
  addListeners(socket);
};
