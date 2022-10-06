import * as ServerToClientEventNames from '../constants/server-to-client-event-names.constants';
import { ClientListUpdatedEventData } from './data/server-to-client/client-list-updated-event-data.interface';

export interface ServerToClientEvents {
  [ServerToClientEventNames.CLIENT_LIST_UPDATED]: (
    data: ClientListUpdatedEventData
  ) => void;
}
