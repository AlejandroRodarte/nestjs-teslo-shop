import * as ServerToClientEventNames from '../constants/server-to-client-event-names.constants';
import { ClientListUpdatedContext } from './contexts/client-list-updated-context.interface';
import { ServerMessageSentContext } from './contexts/server-message-sent-context.interface';

export interface ListenerContexts {
  [ServerToClientEventNames.CLIENT_LIST_UPDATED]: ClientListUpdatedContext;
  [ServerToClientEventNames.SERVER_MESSAGE_SENT]: ServerMessageSentContext;
}
