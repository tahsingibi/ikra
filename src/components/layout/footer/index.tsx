import { GITHUB_REPO_URL, SITE_URL } from "@/data/sources/catalog";

export function Footer() {
  const year = new Date().getFullYear();
  const displaySiteUrl = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <footer
      className="mt-auto border-t border-line bg-elevated/40"
      style={{
        paddingBottom:
          "calc(var(--player-h) + var(--reader-nav-h) + env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 text-xs text-muted sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-[0.2em] text-[var(--fg)]">
              İKRA
            </span>
            <span className="text-muted/60">·</span>
            <span>Açık kaynak Kur’an okuma uygulaması</span>
          </div>
          <span className="text-[11px] text-muted/80">© {year} İKRA.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-medium">
          <a
            href="https://sungur.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            sungur.dev
          </a>
          <span className="text-line" aria-hidden="true">·</span>
          <a
            href="https://x.com/tahsingibi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            @tahsingibi
          </a>
          <span className="text-line" aria-hidden="true">·</span>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <span className="text-line" aria-hidden="true">·</span>
          <a
            href={SITE_URL}
            className="transition-colors hover:text-accent"
          >
            {displaySiteUrl}
          </a>
        </div>
      </div>
    </footer>
  );
}
