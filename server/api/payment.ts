//@ts-ignore
import { EventHandlerRequest } from "h3"; //@ts-ignore
import WebSocket from "ws"; //@ts-ignore

//@ts-ignore
export default defineEventHandler(async (event: EventHandlerRequest) => {
  const { amount, originEmail, paymentEmail, stripeCustomerId } =
    await readBody(event);

  console.log("PAYMENT EVENT", event.body);
  console.log("PAYMENT DATA", {
    amount,
    originEmail,
    paymentEmail,
    stripeCustomerId,
  });

  const paymentData = { amount, originEmail, paymentEmail, stripeCustomerId };

  const nitro = useNitroApp();
  const wsServer = nitro.wsServer;

  console.log("WS SERVER", wsServer);

  if (wsServer) {
    wsServer.broadcast(WebSocketChannel.PAYMENT, paymentData);
  }

  return {
    statusCode: 200,
    data: { status: "ok" },
  };
});
