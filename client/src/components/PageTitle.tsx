import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "SatChat Dashboard",
  "/login": "Login",
  "/register": "Register",
};

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = titles[location.pathname] ?? "SatChat";
  }, [location.pathname]);

  return null;
}
