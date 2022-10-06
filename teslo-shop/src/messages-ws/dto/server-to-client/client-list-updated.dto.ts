export interface ClientListUpdatedEventData {
  clientIds: string[];
}

export class ClientListUpdatedDto {
  clientIds: string[];

  constructor(clientIds: string[]) {
    this.clientIds = clientIds;
  }
}
