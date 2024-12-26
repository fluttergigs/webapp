import { WebSocketServer } from "ws";
import { EventHandlerRequest } from "h3";

let wss: WebSocketServer;

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event: EventHandlerRequest) => {
    /* // const server = event.node.res.socket?.server;
     
         const server = new Server(nitroApp.h3App.handler);
         // if (!!server) {
         if (!WebSocketManager.getInstance().isInitialized()) {
           console.log("Initializing WebSocket server from plugin");
           WebSocketManager.getInstance().initialize(server);
         }*/
  });
});
