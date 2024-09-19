//@ts-ignore
import {EventHandlerRequest} from "h3";
//@ts-ignore
import WebSocket from "ws";
import {WebSocketChannel} from "~/server/utils/websocket_types";
import {WebSocketManager} from "~/server/utils/websocket_manager";
//@ts-ignore
export default defineEventHandler(async (event: EventHandlerRequest) => {
    const {amount, originEmail, paymentEmail, stripeCustomerId} = await readBody(event);
    const wsManager = WebSocketManager.getInstance()

    console.log('PAYMENT EVENT', event.body)
    console.log('PAYMENT DATA', {amount, originEmail, paymentEmail, stripeCustomerId})

    const paymentData = {amount, originEmail, paymentEmail, stripeCustomerId}

    // Broadcast to a specific channel
    wsManager.broadcastToChannel(WebSocketChannel.PAYMENT, {data: paymentData})

    return {
        statusCode: 200,
        data: {'status': 'ok'}
    }
});