//@ts-ignore
import { EventHandlerRequest } from 'h3';
//@ts-ignore
import WebSocket from 'ws';
import { WebsocketClientManager } from '~/server/utils/websocket_manager';

//@ts-ignore

//@ts-ignore
export default defineEventHandler(async (event: EventHandlerRequest) => {
  const paymentData = await readBody(event);

  try {
    for (const [key, peer] of WebsocketClientManager.getInstance().peersList.entries()) {
      peer.publish(WebSocketChannel.PAYMENT, paymentData);
      return;
    }
  } catch (e) {
    console.error('Error sending payment data', e);
  }

  return {
    statusCode: 200,
    data: { status: 'ok' },
  };
});
