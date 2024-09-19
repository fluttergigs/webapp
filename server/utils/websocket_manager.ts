import WebSocket, {WebSocketServer} from "ws"

import {WebSocketChannel, WebSocketMessage, WebSocketMessageType} from './websocket_types'
import {logDev} from "~/core/helpers/log";

interface ChannelSubscription {
    ws: WebSocket;
    channels: Set<WebSocketChannel>;
}

export class WebSocketManager {
    private static instance: WebSocketManager
    private wss: WebSocketServer | null = null
    private subscriptions: Map<WebSocket, ChannelSubscription> = new Map()

    private constructor() {
    }

    private initialized: boolean = false

    isInitialized(): boolean {
        return this.initialized
    }

    static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager()
        }
        return WebSocketManager.instance
    }

    initialize(server: any): void {
        try {
            if (!this.wss && !this.initialized) {
                this.wss = new WebSocketServer({noServer: true})

                server.on('upgrade', (request, socket, head) => {
                    //@ts-ignore
                    this.wss.handleUpgrade(request, socket, head, (ws) => {
                        //@ts-ignore
                        this.wss.emit('connection', ws, request);
                    });
                    /* if (request.url === '/') {  // Define a specific path for WebSocket connections
                         this.wss.handleUpgrade(request, socket, head, (ws) => {
                             this.wss.emit('connection', ws, request)
                         })
                     } else {
                         socket.destroy()
                     }*/
                });

                this.setupEventListeners()

            }
        } catch (e) {
            console.log('Error initializing WebSocket server', e)
        }
    }

    private setupEventListeners(): void {
        if (!this.wss) return
        this.initialized = true

        this.wss.on('connection', (socket: WebSocket) => {
            // socket.send("connected")
            console.log('New WebSocket connection')
            this.subscriptions.set(socket, {ws: socket, channels: new Set()})

            // socket.on('message', (message: Data) => this.handleMessage(socket, message))
            socket.on('close', () => {
                logDev('WebSocket connection closed')
                this.subscriptions.delete(socket)
            })
        })
    }

    private handleMessage(socket: WebSocket, message: Data): void {
        console.log('Handling message', message)
        try {
            const {type, channel, data} = JSON.parse(message.toString()) as WebSocketMessage
            switch (type) {
                case WebSocketMessageType.SUBSCRIBE:
                    this.subscribeToChannel(socket, channel)
                    break
                case WebSocketMessageType.UNSUBSCRIBE:
                    this.unsubscribeFromChannel(socket, channel)
                    break
                case WebSocketMessageType.MESSAGE:
                    this.broadcastToChannel(channel, data)
                    break
                default:
                    logDev('Unknown message type:', type)
            }
        } catch (error) {
            logDev('Error handling message:', error)
        }
    }

    private subscribeToChannel(ws: WebSocket, channel: WebSocketChannel): void {
        const subscription = this.subscriptions.get(ws)
        if (subscription) {
            subscription.channels.add(channel)
            this.sendToClient(ws, {
                type: WebSocketMessageType.SUBSCRIBED,
                channel
            })
        }
    }

    private unsubscribeFromChannel(ws: WebSocket, channel: WebSocketChannel): void {
        const subscription = this.subscriptions.get(ws)
        if (subscription) {
            subscription.channels.delete(channel)
            this.sendToClient(ws, {
                type: WebSocketMessageType.UNSUBSCRIBED,
                channel
            })
        }
    }

    broadcastToChannel(channel: WebSocketChannel, data: any): void {
        this.subscriptions.forEach((subscription) => {
            if (subscription.channels.has(channel) && subscription.ws.readyState === WebSocket.OPEN) {
                this.sendToClient(subscription.ws, {
                    type: WebSocketMessageType.MESSAGE,
                    channel,
                    data
                })
            }
        })
    }

    sendTo(clientId: string, channel: WebSocketChannel, data: any): void {
        const targetSubscription = Array.from(this.subscriptions.values()).find(
            (sub: any) => sub.ws.id === clientId
        )
        if (targetSubscription && targetSubscription.channels.has(channel) &&
            targetSubscription.ws.readyState === WebSocket.OPEN) {
            this.sendToClient(targetSubscription.ws, {
                type: WebSocketMessageType.MESSAGE,
                channel,
                data
            })
        }
    }

    private sendToClient(ws: WebSocket, message: WebSocketMessage): void {
        ws.send(JSON.stringify(message))
    }

    toJSON() {
        return {...this}
    }
}