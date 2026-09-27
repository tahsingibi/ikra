"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/sureler", label: "Sureler" },
  { href: "/nuzul", label: "Nüzul" },
  { href: "/cuz", label: "Cüzler" },
  { href: "/ara", label: "Ara" },
  { href: "/yer-imleri", label: "Yer imleri" },
  { href: "/favoriler", label: "Favoriler" },
  { href: "/ayarlar", label: "Ayarlar" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[0.18em]">İKRA</span>
          <span className="hidden text-sm text-muted sm:inline">Oku.</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm text-muted hover:text-foreground",
                pathname.startsWith(link.href) && "bg-mute text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="relative lg:hidden">
          <Dropdown
            align="end"
            width={220}
            trigger={
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-foreground hover:bg-mute active:bg-mute/80"
                aria-haspopup="menu"
                aria-label="Menü"
              >
                ☰
              </button>
            }
          >
            <nav className="grid gap-1" aria-label="Mobil menü">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm hover:bg-mute"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
