"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { surahPath } from "@/lib/paths";
import { QuickNav } from "@/features/reader/quick-nav";
import type { Surah } from "@/types/quran";

export function ReaderBottomNav({
  surah,
  neighbors,
}: {
  surah: Surah;
  neighbors: { previous?: Surah; next?: Surah };
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
      aria-label="Sure dolaşımı"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2">
        {neighbors.previous ? (
          <Link className="min-h-11 px-3 py-2 text-sm flex items-center justify-center" href={surahPath(neighbors.previous.number)}>
            ← {neighbors.previous.name}
          </Link>
        ) : (
          <span />
        )}
        
        <QuickNav current={surah} />

        {neighbors.next ? (
          <Link className="min-h-11 px-3 py-2 text-sm flex items-center justify-center" href={surahPath(neighbors.next.number)}>
            {neighbors.next.name} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
