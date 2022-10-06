import { Server } from 'socket.io';
import { ClientToServerEvents } from '../messages-ws/interfaces/client-to-server-events.interface';
import { ServerToClientEvents } from '../messages-ws/interfaces/server-to-client-events.interface';
import { InterServerEvents } from '../messages-ws/interfaces/inter-server-events.interface';
import { SocketData } from '../messages-ws/interfaces/socket-data.interface';

export type AppWsServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
