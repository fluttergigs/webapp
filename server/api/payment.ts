//@ts-ignore
import {EventHandlerRequest} from "h3";
//@ts-ignore
import WebSocket from "ws";
//@ts-ignore
export default defineEventHandler(async (event: EventHandlerRequest) => {
    const {amount, originEmail, paymentEmail, stripeCustomerId} = await readBody(event);

    console.log('PAYMENT EVENT', event.body)
    console.log('PAYMENT DATA', {amount, originEmail, paymentEmail, stripeCustomerId})

    const paymentData = {amount, originEmail, paymentEmail, stripeCustomerId}

    console.log("globalThis", globalThis.clients)
    //@ts-ignore
    globalThis.clients.forEach(function (client, isBinary) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(paymentData))
        }
    })

    return {
        statusCode: 200,
        data: {'status': 'ok'}
    }
});