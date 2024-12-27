import type { Message, Peer } from "crossws";

export default defineWebSocketHandler({
  open(peer: Peer) {
    peer.subscribe(WebSocketChannel.PAYMENT);
    peer.subscribe(WebSocketChannel.NOTIFICATIONS);
  },

  message(peer: Peer, message: Message) {},

  close(peer: Peer) {},
});

const nitro = useNitroApp();
if (!nitro.wsServer) {
  nitro.wsServer = this;
}
