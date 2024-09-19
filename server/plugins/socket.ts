import {EventHandlerRequest} from "h3";

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event: EventHandlerRequest) => {
        const server = event.node.res.socket?.server

        /*if (!!server) {
            if (!WebSocketManager.getInstance().isInitialized()) {
                console.log('Initializing WebSocket server from plugin')
                WebSocketManager.getInstance().initialize(server)
            }
        }*/
    })
})