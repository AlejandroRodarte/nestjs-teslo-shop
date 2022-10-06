export class ClientListUpdatedEventDto {
  clientIds: string[];

  constructor(clientIds: string[]) {
    this.clientIds = clientIds;
  }
}
