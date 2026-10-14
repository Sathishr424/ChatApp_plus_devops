export interface Toast {
  id: number,
  message: string,
  type: ToastType
}

export interface ToastSubscriber {
  id: number,
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
}

export const ToastType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type ToastType =
  typeof ToastType[keyof typeof ToastType];
