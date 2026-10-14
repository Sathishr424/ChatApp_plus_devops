import type { Toast, ToastSubscriber, ToastType } from "./interfaces";

export class ToastSystem {
  private subscribers: ToastSubscriber[] = [];
  private last_id: number = 0;
  private subscriber_id: number = 0;


  public subscribe(setToasts: React.Dispatch<React.SetStateAction<Toast[]>>) {
    this.subscriber_id += 1;
    const subscriber: ToastSubscriber = {
      id: this.subscriber_id,
      setToasts: setToasts
    };
    this.subscribers.push(subscriber);
    return subscriber.id;
  }

  public unSubscribe(id: number) {
    this.subscribers = this.subscribers.filter(sub => sub.id !== id);
  }

  private nextId() {
    this.last_id += 1;
    return this.last_id;
  }

  public alert(message: string, type: ToastType) {
    const toast: Toast = {
      id: this.nextId(),
      message,
      type
    }
    this.subscribers.forEach(sub => {
      sub.setToasts(prev => [...prev, toast]);

      setTimeout(() => {
        sub.setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000)
    })
  }
}
