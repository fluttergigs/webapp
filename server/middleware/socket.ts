//@ts-ignore
import EventHandlerRequest from "h3";

export default defineEventHandler((event: EventHandlerRequest) => {
    if (!WebSocketManager.getInstance().isInitialized()) {
        console.log('Initializing WebSocket server from middleware')
        WebSocketManager.getInstance().initialize()
    }
})