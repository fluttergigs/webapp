

export type ToastConfig<P> = {
    [T in keyof P]?: P[T]
}

export abstract class BaseToast<NotificationData> {

    abstract info(config?: ToastConfig<NotificationData>, title?: string): void;

    abstract success(config?: ToastConfig<NotificationData>, title?: string): void;

    abstract error(config?: ToastConfig<NotificationData>, title?: string): void;

    abstract primary(config?: ToastConfig<NotificationData>, title?: string): void;

    abstract default(config?: ToastConfig<NotificationData>, title?: string): void;

    abstract custom(config: ToastConfig<NotificationData>): void;
}

