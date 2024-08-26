export type ToastConfig<P> = {
    [T in keyof P]?: P[T]
}

export abstract class BaseToast<NotificationData = any> {
    protected timeout = 7000;

    abstract info(title: string, config?: ToastConfig<NotificationData>): void;

    abstract success(title: string, config?: ToastConfig<NotificationData>): void;

    abstract error(title: string, config?: ToastConfig<NotificationData>): void;

    abstract primary(title: string, config?: ToastConfig<NotificationData>): void;

    abstract default(title: string, config?: ToastConfig<NotificationData>): void;

    abstract custom(config: ToastConfig<NotificationData>): void;
}

