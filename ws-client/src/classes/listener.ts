import { ListenerContexts } from '../interfaces/listener-contexts.interface';
import { ServerToClientEvents } from '../interfaces/server-to-client-events.interface';
import { ClientSocket } from '../types/client-socket.type';

export abstract class Listener<EventName extends keyof ServerToClientEvents> {
  private readonly socket: ClientSocket;
  protected readonly ctx: ListenerContexts[EventName];

  protected abstract readonly event: keyof ServerToClientEvents;
  protected abstract readonly listener: ServerToClientEvents[EventName];

  constructor(socket: ClientSocket, ctx: ListenerContexts[EventName]) {
    this.socket = socket;
    this.ctx = ctx;
  }

  public subscribe(): void {
    this.socket.on(this.event, this.listener);
  }
}
