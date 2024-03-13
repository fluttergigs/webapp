//@ts-ignore
import * as toast from 'vue-toast-notification';
// const toast = useToast();

export default defineNuxtPlugin(() => {
    return {
        provide: {
            toast: toast.useToast({
                position: 'top',
                duration: 6500,
                pauseOnHover: true,
                dismissible: true,
            })
        }
    }
});