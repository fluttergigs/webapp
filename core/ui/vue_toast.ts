// @ts-ignore
import type { Notification } from '#ui/types';
import type { ToastConfig } from '~/core/ui/base_toast';
import { BaseToast } from '~/core/ui/base_toast';

export class VueToastImpl extends BaseToast<Notification, number> {
  private toast = useToast();

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

  default(title: string, config?: ToastConfig<Notification>): void {
    this.clear();

    this.toast.add({
      id: this.currentNotification.toString(),
      title: title ?? config?.title,
      description: config?.description,
      duration: config?.timeout ?? this.timeout,
      onClick: config?.click,
      color: 'info',
    });
  }

  error(title: string, config?: ToastConfig<Notification>): void {
    this.clear();

    this.toast.add({
      id: this.currentNotification.toString(),
      title: title ?? config?.title,
      description: config?.description,
      duration: config?.timeout ?? this.timeout,
      color: 'error',
      onClick: config?.click,
    });
  }

  info(title: string, config?: ToastConfig<Notification>): void {
    this.clear();

    this.toast.add({
      id: this.currentNotification.toString(),
      title: title ?? config?.title,
      description: config?.description,
      duration: config?.timeout ?? this.timeout,
      color: 'primary',
      onClick: config?.click,
    });
  }

  primary(title: string, config?: ToastConfig<Notification>): void {
    this.clear();

    this.toast.add({
      id: this.currentNotification.toString(),
      title: title ?? config?.title,
      description: config?.description,
      duration: config?.timeout ?? this.timeout,
      color: 'primary',
      onClick: config?.click,
    });
  }

  success(title: string, config?: ToastConfig<Notification>): void {
    this.clear();

    this.toast.add({
      id: this.currentNotification.toString(),
      title: title ?? config?.title,
      description: config?.description,
      duration: config?.timeout ?? this.timeout,
      color: 'success',
      onClick: config?.click,
    });
  }

  custom(config: ToastConfig<Notification>): void {
    this.clear();

    this.toast.add({
      id: this.currentNotification.toString(),
      title: config.title ?? 'Notification',
      description: config.description,
      actions: config.actions,
      duration: config.timeout,
      color: config.color,
      onClick: config.click,
    });
  }

  clear(id?: number): void {
    this.toast.clear();
    // this.toast.remove((id ?? this.currentNotification).toString());
    // this.resetCurrentNotificationId();
  }
}
