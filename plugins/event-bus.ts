// @ts-ignore
import mitt from 'mitt'

type ApplicationEvents = {
};
export default defineNuxtPlugin(() => {
    const emitter = mitt<ApplicationEvents>()

    return {
        provide: {
            event: emitter.emit, // Will emit an event
            listen: emitter.on // Will register a listener for an event
        }
    }
})
