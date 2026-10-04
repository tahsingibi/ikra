"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Route } from "next";
import { QuickNav } from "@/features/reader/quick-nav";
import type { Surah } from "@/types/quran";

export type ReaderNeighbor = {
  href: Route;
  label: string;
};

export function ReaderBottomNav({
  surah,
  neighbors,
  currentAyah,
  verseMode = false,
}: {
  surah: Surah;
  neighbors: { previous?: ReaderNeighbor; next?: ReaderNeighbor };
  currentAyah?: number;
  verseMode?: boolean;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = navRef.current;
    if (!node) return;
    const apply = () => {
      document.documentElement.style.setProperty("--reader-nav-h", `${node.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--reader-nav-h", "0px");
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 z-30 border-t border-line bg-elevated/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      style={{ bottom: "var(--player-h)" }}
      aria-label={verseMode ? "Ayet dolaşımı" : "Sure dolaşımı"}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2">
        {neighbors.previous ? (
          <Link
            className="flex min-h-11 min-w-0 max-w-[38%] items-center justify-center truncate px-3 py-2 text-sm"
            href={neighbors.previous.href}
          >
            ← {neighbors.previous.label}
          </Link>
        ) : (
          <span className="min-w-0 max-w-[38%]" />
        )}

        <QuickNav current={surah} currentAyah={currentAyah} />

        {neighbors.next ? (
          <Link
            className="flex min-h-11 min-w-0 max-w-[38%] items-center justify-center truncate px-3 py-2 text-sm"
            href={neighbors.next.href}
          >
            {neighbors.next.label} →
          </Link>
        ) : (
          <span className="min-w-0 max-w-[38%]" />
        )}
      </div>
    </nav>
  );
}
