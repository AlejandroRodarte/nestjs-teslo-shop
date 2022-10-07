import * as ServerToClientEventNames from '../constants/server-to-client-event-names.constants';
import { ClientListUpdatedEventDto } from '../dto/server-to-client/client-list-updated.dto';
import { ServerMessageSentDto } from '../dto/server-to-client/server-message-sent.dto';

export interface ServerToClientEvents {
  [ServerToClientEventNames.CLIENT_LIST_UPDATED]: (
    data: ClientListUpdatedEventDto
  ) => void;
  [ServerToClientEventNames.SERVER_MESSAGE_SENT]: (
    data: ServerMessageSentDto
  ) => void;
}
