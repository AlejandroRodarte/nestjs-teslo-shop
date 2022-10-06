import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { AppWsServer } from 'src/types/app-ws-server.type';
import { AppClientSocket } from 'src/types/app-client-socket.type';
import * as ServerToClientEventNames from './constants/server-to-client-event-names.constants';
import * as ClientToServerEventNames from './constants/client-to-server-event-names.constants';
import { ClientListUpdatedDto } from './dto/server-to-client/client-list-updated.dto';
import { ClientMessageSentDto } from './dto/client-to-server/client-message-sent.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements
    OnGatewayConnection<AppClientSocket>,
    OnGatewayDisconnect<AppClientSocket>
{
  @WebSocketServer()
  private readonly wss: AppWsServer;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: AppClientSocket, ...args: any[]) {
    this.messagesWsService.addClient(client);
    this.wss.emit(
      ServerToClientEventNames.CLIENT_LIST_UPDATED,
      new ClientListUpdatedDto(this.messagesWsService.getConnectedClientIds()),
    );
  }

  handleDisconnect(client: AppClientSocket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      ServerToClientEventNames.CLIENT_LIST_UPDATED,
      new ClientListUpdatedDto(this.messagesWsService.getConnectedClientIds()),
    );
  }

  @SubscribeMessage(ClientToServerEventNames.CLIENT_MESSAGE_SENT)
  onClientMessageSent(
    client: AppClientSocket,
    @MessageBody() data: ClientMessageSentDto,
  ): void {
    console.log(data);
  }
}
