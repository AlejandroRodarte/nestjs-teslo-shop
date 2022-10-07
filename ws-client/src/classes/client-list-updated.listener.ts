import { CLIENT_LIST_UPDATED } from '../constants/server-to-client-event-names.constants';
import { ClientListUpdatedEventDto } from '../dto/server-to-client/client-list-updated.dto';
import { Listener } from './listener';
import { ClientSocket } from '../types/client-socket.type';
import { ClientListUpdatedContext } from '../interfaces/contexts/client-list-updated-context.interface';

export class ClientListUpdatedListener extends Listener<
  typeof CLIENT_LIST_UPDATED
> {
  protected event: typeof CLIENT_LIST_UPDATED = CLIENT_LIST_UPDATED;

  protected listener = (data: ClientListUpdatedEventDto): void => {
    let clientsHtml = '';
    data.clientIds.forEach((clientId) => {
      clientsHtml += `
        <li>${clientId}</li>
      `;
    });
    this.ctx.clientsUl.innerHTML = clientsHtml;
  };

  constructor(socket: ClientSocket, ctx: ClientListUpdatedContext) {
    super(socket, ctx);
  }
}
