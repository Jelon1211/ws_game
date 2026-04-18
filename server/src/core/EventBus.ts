type Handler<T> = (payload: T) => void;

export class EventBus {
  private listeners = new Map<string, Handler<unknown>[]>();

  public on<T>(event: string, handler: Handler<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(handler as Handler<unknown>);
  }

  public emit<T>(event: string, payload: T) {
    this.listeners.get(event).forEach((fn) => fn(payload as unknown));
  }
}
