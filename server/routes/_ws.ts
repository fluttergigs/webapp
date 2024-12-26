import type { Message, Peer } from "crossws";

export default defineWebSocketHandler({
  open(peer: Peer) {},

  message(peer: Peer, message: Message) {},

  close(peer: Peer) {},
});
