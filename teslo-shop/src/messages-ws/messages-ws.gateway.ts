import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    ...args: any[]
  ) {
    this.messagesWsService.addClient(client);
    console.log(
      `${this.messagesWsService.getAmountOfConnectedClients()} clients connected`,
    );
  }

  handleDisconnect(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    this.messagesWsService.removeClient(client.id);
    console.log(
      `${this.messagesWsService.getAmountOfConnectedClients()} clients connected`,
    );
  }
}
