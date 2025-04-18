import { WebSocketChannel } from './websocket_types';
import { Peer } from 'crossws';

interface ChannelSubscription {
  ws: WebSocket;
  channels: Set<WebSocketChannel>;
}

/*
export class WebSocketManager {
  private static instance: WebSocketManager;
  private wss: WebSocketServer | null = null;
  private subscriptions: Map<WebSocket, ChannelSubscription> = new Map();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  initialize(server: any): void {
    try {
      if (!this.wss && !this.initialized) {
        console.log("initialize websocket");
        this.wss = new WebSocketServer({ noServer: true });

        server.on("upgrade", (request, socket, head) => {
          console.log("handling websocket upgrade");

          // Verify it's a WebSocket upgrade request
          if (request.headers.upgrade?.toLowerCase() !== "websocket") {
            socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
            return;
          }
          this.wss.handleUpgrade(request, socket, head, (ws) => {
            console.log("upgrade websocket");
            this.wss.emit("connection", ws, request);
          });
        });

        this.setupEventListeners();
      }
    } catch (e) {
      console.error("Error initializing WebSocket server", e);
    }
  }

  broadcastToChannel(channel: WebSocketChannel, data: any): void {
    this.subscriptions.forEach((subscription) => {
      if (
        subscription.channels.has(channel) &&
        subscription.ws.readyState === WebSocket.OPEN
      ) {
        this.sendToClient(subscription.ws, {
          type: WebSocketMessageType.MESSAGE,
          channel,
          data,
        });
      }
    });
  }

  sendTo(clientId: string, channel: WebSocketChannel, data: any): void {
    const targetSubscription = Array.from(this.subscriptions.values()).find(
      (sub: any) => sub.ws.id === clientId
    );
    if (
      targetSubscription &&
      targetSubscription.channels.has(channel) &&
      targetSubscription.ws.readyState === WebSocket.OPEN
    ) {
      this.sendToClient(targetSubscription.ws, {
        type: WebSocketMessageType.MESSAGE,
        channel,
        data,
      });
    }
  }

  toJSON() {
    return { ...this };
  }

  private setupEventListeners(): void {
    if (!this.wss) return;
    console.log("Setting up WebSocket event listeners");

    this.initialized = true;

    this.wss.on("connection", (socket: WebSocket) => {
      socket.send("connected to server");
      console.log("New WebSocket connection");

      this.subscriptions.set(socket, { ws: socket, channels: new Set() });

      socket.on("message", (message: Data) => {
        this.handleMessage(socket, message);
      });

      socket.on("close", (event) => {
        console.log("WebSocket connection closed", event);
        this.subscriptions.delete(socket);
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  private handleMessage(socket: WebSocket, message: Data): void {
    console.log("Handling received message", JSON.parse(message));
    try {
      const { type, channel, data } = JSON.parse(message) as WebSocketMessage;
      switch (type) {
        case WebSocketMessageType.SUBSCRIBE:
          this.subscribeToChannel(socket, channel);
          break;
        case WebSocketMessageType.UNSUBSCRIBE:
          this.unsubscribeFromChannel(socket, channel);
          break;
        case WebSocketMessageType.MESSAGE:
          this.broadcastToChannel(channel, data);
          break;
        default:
          logDev("Unknown message type:", type);
      }
    } catch (error) {
      console.log("Error handling message:", error);
    }
  }

  private subscribeToChannel(ws: WebSocket, channel: WebSocketChannel): void {
    try {
      const subscription = this.subscriptions.get(ws);
      if (subscription) {
        console.log("subscribeToChannel", channel);

        subscription.channels.add(channel);
        this.sendToClient(ws, {
          type: WebSocketMessageType.SUBSCRIBED,
          channel,
        });
      }
    } catch (e) {
      console.error("Error subscribing to channel", e);
    }
  }

  private unsubscribeFromChannel(
    ws: WebSocket,
    channel: WebSocketChannel
  ): void {
    const subscription = this.subscriptions.get(ws);
    if (subscription) {
      subscription.channels.delete(channel);
      this.sendToClient(ws, {
        type: WebSocketMessageType.UNSUBSCRIBED,
        channel,
      });
    }
  }

  private sendToClient(ws: WebSocket, message: WebSocketMessage): void {
    ws.send(JSON.stringify(message));
  }
}
*/


export class WebsocketClientManager {
  private static instance: WebsocketClientManager;
  private peers = new Map<string, Peer>();

  private singlePeer: Peer | null = null;

  //define singleton constructor
  private constructor() {
  }

  get peer(): Peer<any> | null {
    return this.singlePeer;
  }

  get peersList(): Map<string, Peer> {
    return this.peers;
  }

  static getInstance(): WebsocketClientManager {
    if (!WebsocketClientManager.instance) {
      WebsocketClientManager.instance = new WebsocketClientManager();
    }
    return WebsocketClientManager.instance;
  }

  setPeer(peer: Peer) {
    this.singlePeer = peer;
  }

  getPeerFromList(clientId: string) {
    return this.peers.get(clientId);
  }

  addPeer(clientId: string, ws: Peer) {
    this.peers.set(clientId, ws);
  }

  removePeer(clientId: string) {
    this.peers.delete(clientId);
  }

}
