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

let socket: ClientSocket;
let clientListUpdatedListener: ClientListUpdatedListener | null;
let serverMessageSentListener: ServerMessageSentListener | null;

const addListeners = () => {
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

  clientListUpdatedListener = new ClientListUpdatedListener(socket, {
    clientsUl,
  });
  serverMessageSentListener = new ServerMessageSentListener(socket, {
    messagesUl,
  });

  clientListUpdatedListener.subscribe();
  serverMessageSentListener.subscribe();

  const messageFormSubmitHandler: (
    this: HTMLFormElement,
    ev: SubmitEvent
  ) => any = (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit(
      ClientToServerEventNames.CLIENT_MESSAGE_SENT,
      new ClientMessageSentDto('abc', messageInput.value)
    );

    messageInput.value = '';
  };

  messageForm.removeEventListener('submit', messageFormSubmitHandler);
  messageForm.addEventListener('submit', messageFormSubmitHandler);
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

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    clientListUpdatedListener = null;
    serverMessageSentListener = null;
  }
  socket = manager.socket('/');
  addListeners();
};
