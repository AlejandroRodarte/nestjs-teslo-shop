import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './interfaces/connected-clients.interface';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MessagesWsService {
  private readonly connectedClients: ConnectedClients = {};

  constructor(private readonly authService: AuthService) {}

  async addClient(client: Socket, userId: string): Promise<void> {
    const foundUser = await this.authService.findOneUserEntity(userId);
    this.connectedClients[client.id] = {
      socket: client,
      user: foundUser,
    };
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClientIds(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserByClientId(socketId: string): User {
    return this.connectedClients[socketId].user;
  }
}
