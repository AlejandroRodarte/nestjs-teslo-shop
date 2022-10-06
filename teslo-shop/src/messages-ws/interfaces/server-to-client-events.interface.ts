import * as ServerToClientEventNames from '../constants/server-to-client-event-names.constants';
import { ClientListUpdatedDto } from '../dto/server-to-client/client-list-updated.dto';

export interface ServerToClientEvents {
  [ServerToClientEventNames.CLIENT_LIST_UPDATED]: (
    data: ClientListUpdatedDto,
  ) => void;
}
