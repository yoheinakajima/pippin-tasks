import { Task } from "@db/schema";

type WebSocketMessage = {
  type: "TASK_CREATED" | "TASK_UPDATED" | "TASK_DELETED";
  task?: Task;
  taskId?: number;
};

export class TaskWebSocket {
  private ws: WebSocket;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];

  constructor() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.ws = new WebSocket(`${protocol}//${window.location.host}`);

    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.messageHandlers.forEach((handler) => handler(message));
    };

    this.ws.onclose = () => {
      setTimeout(() => new TaskWebSocket(), 1000);
    };
  }

  public onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }
}

export const taskWebSocket = new TaskWebSocket();
