import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AudioBar } from "@/features/audio/audio-bar";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { OfflineGate } from "@/features/offline/offline-gate";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a className="skip-link" href="#icerik">
        İçeriğe geç
      </a>
      <Header />
      <OfflineBanner />
      <main id="icerik" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-6">
        <OfflineGate>{children}</OfflineGate>
      </main>
      <Footer />
      <AudioBar />
      <InstallPrompt />
    </div>
  );
}
