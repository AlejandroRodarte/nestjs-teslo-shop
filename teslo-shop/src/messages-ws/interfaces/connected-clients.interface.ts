import { AppClientSocket } from 'src/types/app-client-socket.type';
import { User } from '../../auth/entities/user.entity';

export interface ConnectedClients {
  [id: string]: {
    socket: AppClientSocket;
    user: User;
  };
}
