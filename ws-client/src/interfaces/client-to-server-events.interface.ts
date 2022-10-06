import * as ClientToServerEventNames from '../constants/client-to-server-event-names.constants';
import { ClientMessageSentDto } from '../dto/client-to-server/client-message-sent.dto';

export interface ClientToServerEvents {
  [ClientToServerEventNames.CLIENT_MESSAGE_SENT]: (
    data: ClientMessageSentDto
  ) => void;
}
