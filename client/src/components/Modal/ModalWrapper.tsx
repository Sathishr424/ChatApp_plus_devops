import type { ReactNode } from "react";

export default function ModalWrapper({children, isModalOpen}: {children: ReactNode, isModalOpen: boolean}) {
  return isModalOpen ? <>{children}</> : <></>;
}
