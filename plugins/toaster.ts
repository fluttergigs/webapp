//@ts-ignore
import {VueToastImpl} from "~/core/ui/vue_toast";
// const toast = useToast();

export default defineNuxtPlugin(() => {
    return {
        provide: {
            toast: new VueToastImpl()
        }
    }
});

