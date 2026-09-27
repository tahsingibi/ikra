"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const dismissed = window.localStorage.getItem("ikra.install-dismissed");
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (dismissed || standalone) return;
    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as Navigator & { standalone?: boolean }).standalone;
    const onPrompt = (incoming: Event) => {
      incoming.preventDefault();
      setEvent(incoming as BeforeInstallPromptEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const frame = window.requestAnimationFrame(() => {
      setIos(isIos);
      if (isIos) setHidden(false);
    });
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (hidden || (!event && !ios)) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-40 w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-line bg-elevated p-4 shadow-lg">
      <p className="text-sm font-medium">İKRA’yı ana ekranına ekle</p>
      <p className="mt-1 text-sm text-muted">
        {ios
          ? "Paylaş → Ana Ekrana Ekle ile çevrimdışı okumaya geçebilirsin."
          : "Ana ekrana ekleyerek uygulamayı daha hızlı açabilirsin."}
      </p>
      <div className="mt-3 flex gap-2">
        {event ? (
          <Button
            size="sm"
            onClick={async () => {
              await event.prompt();
              setHidden(true);
              window.localStorage.setItem("ikra.install-dismissed", "1");
            }}
          >
            Ekle
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setHidden(true);
            window.localStorage.setItem("ikra.install-dismissed", "1");
          }}
        >
          Şimdi değil
        </Button>
      </div>
    </div>
  );
}
