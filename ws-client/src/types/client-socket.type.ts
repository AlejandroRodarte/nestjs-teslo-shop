import { Socket } from 'socket.io-client';
import { ServerToClientEvents } from '../interfaces/server-to-client-events.interface';
import { ClientToServerEvents } from '../interfaces/client-to-server-events.interface';

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
