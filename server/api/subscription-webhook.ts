//@ts-ignore
import { EventHandlerRequest } from 'h3';
//@ts-ignore
import WebSocket from 'ws';
import { updateUserSubscription } from '~/server/utils/subscription';
import { WebsocketClientManager } from '~/server/utils/websocket_manager';
import { WebSocketChannel } from '~/server/utils/websocket_types';

export default defineEventHandler(async (event: EventHandlerRequest) => {
  const subscriptionData = await readBody(event);

  try {
    // Update user subscription in Strapi
    if (subscriptionData.userId && subscriptionData.tier) {
      await updateUserSubscription(subscriptionData);
    }

    // Broadcast subscription update via WebSocket
    for (const [key, peer] of WebsocketClientManager.getInstance().peersList.entries()) {
      peer.publish(WebSocketChannel.SUBSCRIPTION, subscriptionData);
      return;
    }
  } catch (e) {
    console.error('Error sending subscription data', e);
  }

  return {
    statusCode: 200,
    data: { status: 'ok' },
  };
});
