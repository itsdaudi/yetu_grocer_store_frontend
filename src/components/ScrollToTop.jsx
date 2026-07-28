import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls the window to the top every time the route changes.
// React Router doesn't do this automatically, since it just swaps
// page content in place without a full page reload.
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}