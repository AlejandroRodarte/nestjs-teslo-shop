import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './interfaces/connected-clients.interface';

@Injectable()
export class MessagesWsService {
  private readonly connectedClients: ConnectedClients = {};

  addClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getAmountOfConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }
}
