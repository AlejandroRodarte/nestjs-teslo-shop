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
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
