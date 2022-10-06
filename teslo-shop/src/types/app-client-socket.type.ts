import { Socket } from 'socket.io';
import { ClientToServerEvents } from 'src/messages-ws/interfaces/client-to-server-events.interface';
import { InterServerEvents } from 'src/messages-ws/interfaces/inter-server-events.interface';
import { ServerToClientEvents } from 'src/messages-ws/interfaces/server-to-client-events.interface';
import { SocketData } from 'src/messages-ws/interfaces/socket-data.interface';

export type AppClientSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;
