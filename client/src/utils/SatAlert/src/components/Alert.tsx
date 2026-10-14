import { useEffect, useState } from "react"
import type { Toast } from "../interfaces";
import { SatToast, ToastType } from "../..";
import Success from "./Success";
import Error from "./Error";
import Info from "./Info";

export function Alert() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const id: number = SatToast.subscribe(setToasts);
    return () => SatToast.unSubscribe(id);
  }, [])

  return <div className="fixed top-0 right-0 z-40">
    {
      toasts.map(toast => {
        if (toast.type == ToastType.SUCCESS) return <Success key={toast.id} message={toast.message} />
        if (toast.type == ToastType.ERROR) return <Error key={toast.id} message={toast.message} />
        if (toast.type == ToastType.INFO) return <Info key={toast.id} message={toast.message} />
      })
    }
  </div>
}
