import { Injectable } from '@nestjs/common';
import { ConnectedClients } from './interfaces/connected-clients.interface';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { AppClientSocket } from '../types/app-client-socket.type';

@Injectable()
export class MessagesWsService {
  private readonly connectedClients: ConnectedClients = {};

  constructor(private readonly authService: AuthService) {}

  async addClient(client: AppClientSocket, userId: string): Promise<void> {
    const existingClient = this.getClientByUserId(userId);
    if (existingClient) existingClient.socket.disconnect();

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

  private getClientByUserId(
    userId: string,
  ): ConnectedClients[string] | undefined {
    for (const socketId in this.connectedClients) {
      const connectedClient = this.connectedClients[socketId];
      if (userId === connectedClient.user.id) return connectedClient;
    }
    return undefined;
  }
}
