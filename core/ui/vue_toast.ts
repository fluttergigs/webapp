// @ts-ignore
import type {Notification} from "#ui/types";
import {BaseToast, ToastConfig} from "~/core/ui/base_toast";
import {logDev} from "~/core/helpers/log";

export class VueToastImpl implements BaseToast<Notification> {

    private timeout: number;

    private toast = useToast()

    default(title: string, config?: ToastConfig<Notification>,): void {
        this.toast.add({
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            click: config?.click,
            color: "blue-gray",
        })
    }

    error(title: string, config?: ToastConfig<Notification>): void {
        this.toast.add({
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: "red",
            click: config?.click,
        })
    }

    info(title: string, config?: ToastConfig<Notification>): void {
        this.toast.add({
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: 'primary',
            click: config?.click,

        })
    }

    primary(title: string, config?: ToastConfig<Notification>): void {
        this.toast.add({
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: 'indigo',
            click: config?.click,
        })
    }

    success(title: string, config?: ToastConfig<Notification>): void {
        this.toast.add({
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: 'green',
            click: config?.click,
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