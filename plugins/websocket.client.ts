export default defineNuxtPlugin(() => {
    if (import.meta.server) return
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const socket = new WebSocket(`${wsProtocol}//${window.location.host}/`,)

    return {
        provide: {
            socket,
        },
    }
})