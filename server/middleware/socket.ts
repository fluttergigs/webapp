//@ts-ignore
import EventHandlerRequest from "h3";

export default defineEventHandler((event: EventHandlerRequest) => {
    const server = event.node.res.socket?.server

    if (!!server) {
        if (!WebSocketManager.getInstance().isInitialized()) {
            console.log('Initializing WebSocket server from middleware')
            WebSocketManager.getInstance().initialize(server)
        }
    }
})

/*
import WebSocket, {WebSocketServer} from "ws"

type Client = {
    id: string
    send: (message: any) => void
    readyState: number
}
declare global {
    let wss: WebSocketServer
    let clients: Client[]
}
let wss: WebSocketServer
let clients: Client[] = []

export default defineEventHandler((event) => {
    if (!global.wss) {
        wss = new WebSocketServer({noServer: true})
        const server = event.node.res.socket?.server
        server.on('upgrade', function (request, socket, head) {
            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit('connection', ws, request);
            })
        })
        wss.on("connection", function (socket) {
            socket.send("connected")
            socket.on("message", function (message) {
                wss.clients.forEach(function (client) {
                    if (client == socket && client.readyState === WebSocket.OPEN) {
                        clients.push({
                            id: message.toString(),
                            send: (data: any) => client.send(data),
                            readyState: client.readyState,
                        })
                        global.clients = clients
                    }
                })
            })
            global.wss = wss
        })
    }
})*/
