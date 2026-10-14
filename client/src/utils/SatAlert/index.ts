import { ToastSystem } from "./src/ToastSystem";

export { Alert } from "./src/components/Alert";
export const SatToast = new ToastSystem();
export type { Toast, ToastSubscriber } from "./src/interfaces";
export { ToastType } from "./src/interfaces"
