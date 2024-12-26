export default defineNuxtPlugin(() => {
  if (import.meta.server) return;
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  try {
    const socket = new WebSocket(`${wsProtocol}//${window.location.host}/`);

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      console.error("WebSocket readyState:", socket.readyState);
      console.error("WebSocket URL:", socket.url);
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");

      /*socket.send(
                          JSON.stringify({
                            type: WebSocketMessageType.SUBSCRIBE,
                            channel: WebSocketChannel.NOTIFICATIONS,
                          })
                        );*/
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event);
      console.log("Close code:", event.code);
      console.log("Close reason:", event.reason);
      console.log("Was clean:", event.wasClean);
    };

    return {
      provide: {
        socket: {
          get raw() {
            return socket;
          },

          send: (data: any) => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify(data));
            } else {
              console.error("WebSocket not open");
            }
          },
        },
      },
    };
  } catch (e) {
    console.error("Error initializing WebSocket client", e);
  }
});
