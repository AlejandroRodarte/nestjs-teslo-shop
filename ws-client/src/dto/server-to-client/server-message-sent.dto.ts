export class ServerMessageSentDto {
  fullName: string;
  message: string;

  constructor(fullName: string, message: string) {
    this.fullName = fullName;
    this.message = message;
  }
}
