import {defineNitroPlugin} from 'nitropack/runtime/plugin'
//@ts-ignore
import {EventHandlerRequest} from "h3";

//@ts-ignore
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event: EventHandlerRequest) => {
        /*try {
            if (!WebSocketManager.getInstance().isInitialized()) {
                console.log('Initializing WebSocket server from plugin')
                WebSocketManager.getInstance().initialize()
            }
        } catch (e) {
            console.log('Error initializing WebSocket server', e)
        }*/
    })
})