"use client";

import { AudioProvider } from "@/hooks/use-audio";
import { SettingsProvider } from "@/hooks/use-settings";
import { OfflineProvider } from "@/features/offline/offline-gate";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AudioProvider>
        <OfflineProvider>
          <ServiceWorkerRegister />
          {children}
        </OfflineProvider>
      </AudioProvider>
    </SettingsProvider>
  );
}
