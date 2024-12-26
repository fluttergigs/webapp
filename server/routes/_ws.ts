import type {Message, Peer} from "crossws";

export default defineWebSocketHandler({
    open(peer: Peer) {
        console.log("peer", peer);
    },

    message(peer: Peer, message: Message) {
    },

    close(peer: Peer) {
    },
});
