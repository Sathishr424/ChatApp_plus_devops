import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MobileViewType } from "@/interfaces";
import { ResponsivenessContext } from "./ResponsivenessContext";

export default function ResponsivenessProvider() {
  const [mobileView, setMobileView] = useState<MobileViewType>(MobileViewType.CONVERSATION);
  const [resizeMode, setResizeMode] = useState<number>(0);

  useEffect(() => {
    const handlePopState = () => {
      if (mobileView === MobileViewType.CHAT) {
        setMobileView(MobileViewType.CONVERSATION);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [mobileView]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setResizeMode(1);
      } else {
        setResizeMode(0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openChat = () => {
    setMobileView(MobileViewType.CHAT);

    if (window.innerWidth < 768) {
      window.history.pushState({ chat: true }, "");
    }
  };

  const isSelectedRecipientOnVisibleScreen = useCallback(() => {
    return window.innerWidth >= 768 || mobileView === MobileViewType.CHAT;
    // eslint-disable-next-line
  }, [mobileView, resizeMode])

  const openUnread = () => {
    setMobileView(MobileViewType.CONVERSATION);

    if (window.innerWidth < 768) {
      window.history.pushState({ chat: true }, "");
    }
  };

  return <ResponsivenessContext.Provider value={{ mobileView, openChat, openUnread, isSelectedRecipientOnVisibleScreen }}>
    <Outlet />
  </ResponsivenessContext.Provider>;
}
