import mitt from 'mitt'
import {PaymentType} from "~/repository/modules/transaction/transaction.types";

type ApplicationEvents = {
    'payment:created': { type: PaymentType },
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
