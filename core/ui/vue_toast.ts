// @ts-ignore
import type {Notification} from "#ui/types";
import {BaseToast, ToastConfig} from "~/core/ui/base_toast";
import {logDev} from "~/core/helpers/log";

export class VueToastImpl implements BaseToast<Notification> {

    private toast = useToast()

    default(config: ToastConfig<Notification>, title?: string): void {
        this.toast.add({
            title: config.title ?? title,
            description: config.description,
            timeout: config.timeout,
            click: config.click,
            color: "blue-gray",
        })
    }

    error(config: ToastConfig<Notification>, title?: string): void {
        this.toast.add({
            title: config.title ?? title,
            description: config.description,
            timeout: config.timeout,
            color: "red",
            click: config.click,
        })
    }

    info(config: ToastConfig<Notification>, title?: string): void {
        logDev('INFOING FROM TOASTER')
        this.toast.add({
            title: config.title ?? title,
            description: config.description,
            timeout: config.timeout,
            color: 'primary',
            click: config.click,

        })
    }

    primary(config: ToastConfig<Notification>, title?: string): void {
        this.toast.add({
            title: config.title ?? title,
            description: config.description,
            timeout: config.timeout,
            color: 'indigo',
            click: config.click,
        })
    }

    success(config: ToastConfig<Notification>, title?: string): void {
        this.toast.add({
            title: config.title ?? title,
            description: config.description,
            timeout: config.timeout,
            color: 'green',
            click: config.click,
        })
    }

    custom(config: ToastConfig<Notification>): void {
        this.toast.add({
            title: config.title ?? 'Notification',
            description: config.description,
            timeout: config.timeout,
            color: config.color,
            click: config.click,
        })
    }
}