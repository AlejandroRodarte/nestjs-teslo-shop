import {
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
import { ServerMessageSentDto } from './dto/server-to-client/server-message-sent.dto';
import { JwtService } from '@nestjs/jwt';
import { asyncWrapper } from '../common/helpers/wrappers/async-wrapper.wrapper';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements
    OnGatewayConnection<AppClientSocket>,
    OnGatewayDisconnect<AppClientSocket>
{
  @WebSocketServer()
  private readonly wss: AppWsServer;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AppClientSocket, ...args: any[]) {
    const jwtToken = client.handshake.headers.authorization;

    const verify = async () => {
      const payload = await this.jwtService.verifyAsync(jwtToken);
      return payload as JwtPayload;
    };

    const disconnect = async () => {
      client.disconnect();
    };

    const [jwtPayload, error] = await asyncWrapper(verify, disconnect);
    if (error) return;

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
    data: ClientMessageSentDto,
  ): void {
    this.wss.emit(
      ServerToClientEventNames.SERVER_MESSAGE_SENT,
      new ServerMessageSentDto('John Doe', data.message),
    );
  }
}
