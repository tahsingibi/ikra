"use client";

import { useEffect } from "react";
import { ensureDefaultOfflinePacks } from "@/services/offline";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const frame = window.requestAnimationFrame(() => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          void registration.update();
          void navigator.serviceWorker.ready.then(() => {
            void ensureDefaultOfflinePacks();
          });
        })
        .catch(() => {
          // Service worker optional during local development.
        });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return null;
}
