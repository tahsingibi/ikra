"use client";

import { AudioProvider } from "@/hooks/use-audio";
import { SettingsProvider } from "@/hooks/use-settings";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AudioProvider>
        <ServiceWorkerRegister />
        {children}
      </AudioProvider>
    </SettingsProvider>
  );
}
