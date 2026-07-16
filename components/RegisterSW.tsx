"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // el SW solo en build/prod
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registro fallido — la app sigue funcionando sin offline */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
