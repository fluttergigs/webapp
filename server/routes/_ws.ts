import type { Message, Peer } from 'crossws';
import { WebsocketClientManager } from '~/server/utils/websocket_manager';

export default defineWebSocketHandler({
  open(peer: Peer) {
    peer.subscribe(WebSocketChannel.PAYMENT);
    peer.subscribe(WebSocketChannel.NOTIFICATIONS);
    WebsocketClientManager.getInstance().setPeer(peer);
    WebsocketClientManager.getInstance().addPeer(peer.id, peer);
  },

  message(peer: Peer, message: Message) {

  },
  close(peer: Peer) {
  },
});