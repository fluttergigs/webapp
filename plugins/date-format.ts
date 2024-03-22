//@ts-ignore
import {useDateFormat} from "@vueuse/core";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("dateFormat", (el: any, binding: any) => {
        const {date, format} = binding.value
        el.innerText = useDateFormat(date, format, {locales: 'en-US'}).value
    })


    //alternative syntax
    /*nuxtApp.vueApp.directive('focus', {
        mounted(el: any) {
            el.focus()
        },
        getSSRProps(binding: any, vnode: any) {
            // you can provide SSR-specific props here
            return {}
        }
    })*/
})