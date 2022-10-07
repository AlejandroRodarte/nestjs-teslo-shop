import { SERVER_MESSAGE_SENT } from '../constants/server-to-client-event-names.constants';
import { Listener } from './listener';
import { ServerMessageSentDto } from '../dto/server-to-client/server-message-sent.dto';
import { ClientSocket } from '../types/client-socket.type';
import { ServerMessageSentContext } from '../interfaces/contexts/server-message-sent-context.interface';

export class ServerMessageSentListener extends Listener<
  typeof SERVER_MESSAGE_SENT
> {
  protected event: typeof SERVER_MESSAGE_SENT = SERVER_MESSAGE_SENT;
  protected listener = (data: ServerMessageSentDto): void => {
    const newMessage = `
      <strong>${data.fullName}</strong>
      <span>${data.message}</span>
    `;

    const li = document.createElement('li');
    li.innerHTML = newMessage;
    this.ctx.messagesUl.append(li);
  };

  constructor(socket: ClientSocket, ctx: ServerMessageSentContext) {
    super(socket, ctx);
  }
}
