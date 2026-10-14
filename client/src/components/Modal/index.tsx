import { ModalTransparency } from "@/interfaces";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export default function Modal({ children, setIsModalOpen, handleModalClick, transparency = "MEDIUM" }: { children: ReactNode, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, handleModalClick?: (event: MouseEvent<HTMLElement>) => void, transparency?: ModalTransparency }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Node;

    if (handleModalClick) handleModalClick(event);

    if (target.contains(containerRef.current)) {
      setIsModalOpen(false);
    }
  }

  return <div ref={containerRef} onClick={handleClick} className={`fixed top-0 left-0 p-2 w-screen h-screen flex justify-center items-center z-30 ${ModalTransparency[transparency]}`}>
    {children}
  </div>;
}
