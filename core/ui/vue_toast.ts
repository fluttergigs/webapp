// @ts-ignore
import type {Notification} from "#ui/types";
import {BaseToast, ToastConfig} from "~/core/ui/base_toast";

export class VueToastImpl extends BaseToast<Notification, number> {

    private toast = useToast()

    private currentNotificationId = 0;

    get currentNotification() {
        return this.currentNotificationId;
    }

    incrementCurrentNotificationId() {
        this.currentNotificationId += 1;
    }

    resetCurrentNotificationId() {
        this.currentNotificationId = 0;
    }

    default(title: string, config?: ToastConfig<Notification>,): void {
        this.incrementCurrentNotificationId();
        this.toast.add({
            id: this.currentNotification.toString(),
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            click: config?.click,
            color: "blue-gray",
        })
    }

    error(title: string, config?: ToastConfig<Notification>): void {
        this.incrementCurrentNotificationId();
        this.toast.add({
            id: this.currentNotification.toString(),
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: "red",
            click: config?.click,
        })
    }

    info(title: string, config?: ToastConfig<Notification>): void {
        this.incrementCurrentNotificationId();
        this.toast.add({
            id: this.currentNotification.toString(),
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: 'primary',
            click: config?.click,

        })
    }

    primary(title: string, config?: ToastConfig<Notification>): void {
        this.incrementCurrentNotificationId();
        this.toast.add({
            id: this.currentNotification.toString(),
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: 'indigo',
            click: config?.click,
        })
    }

    success(title: string, config?: ToastConfig<Notification>): void {
        this.incrementCurrentNotificationId();
        this.toast.add({
            id: this.currentNotification.toString(),
            title: title ?? config?.title,
            description: config?.description,
            timeout: config?.timeout ?? this.timeout,
            color: 'green',
            click: config?.click,
        })
    }

    custom(config: ToastConfig<Notification>): void {
        this.incrementCurrentNotificationId();
        this.toast.add({
            id: this.currentNotification.toString(),
            title: config.title ?? 'Notification',
            description: config.description,
            actions: config.actions,
            timeout: config.timeout,
            color: config.color,
            click: config.click,
        })
    }

    clear(id?: number): void {
        this.toast.remove((id ?? this.currentNotification).toString());
    }
}