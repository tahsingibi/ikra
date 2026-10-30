"use client";

import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { Route } from "next";
import { QuickNav } from "@/features/reader/quick-nav";
import { cn } from "@/lib/utils";
import type { Surah } from "@/types/quran";

export type ReaderNeighbor = {
  href: Route;
  label: string;
};

export type ReaderNavModel = {
  surah: Surah;
  neighbors: { previous?: ReaderNeighbor; next?: ReaderNeighbor };
  currentAyah?: number;
  verseMode: boolean;
};

type NavEntry = {
  id: string;
  model: ReaderNavModel;
};

type ReaderNavContextValue = {
  publish: (id: string, model: ReaderNavModel) => void;
  unpublish: (id: string) => void;
};

const ReaderNavContext = createContext<ReaderNavContextValue | null>(null);

export function ReaderNavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<NavEntry[]>([]);
  const api = useMemo<ReaderNavContextValue>(
    () => ({
      publish(id, model) {
        setStack((prev) => [...prev.filter((item) => item.id !== id), { id, model }]);
      },
      unpublish(id) {
        setStack((prev) => (prev.some((item) => item.id === id) ? prev.filter((item) => item.id !== id) : prev));
      },
    }),
    [],
  );
  const active = stack.at(-1)?.model ?? null;

  return (
    <ReaderNavContext.Provider value={api}>
      {children}
      <ReaderBottomNav model={active} />
    </ReaderNavContext.Provider>
  );
}

export function usePublishReaderNav(model: ReaderNavModel | null) {
  const api = useContext(ReaderNavContext);
  const id = useId();

  useLayoutEffect(() => {
    if (!api || !model) return;
    api.publish(id, model);
    return () => api.unpublish(id);
  }, [api, id, model]);
}

function ReaderBottomNav({ model }: { model: ReaderNavModel | null }) {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = navRef.current;
    if (!node) return;
    const apply = () => {
      const height = model && node.offsetHeight ? node.offsetHeight : 0;
      document.documentElement.style.setProperty("--reader-nav-h", `${height}px`);
    };
    apply();
    if (!model) return;
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, [model]);

  const verseMode = model?.verseMode ?? false;

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed inset-x-0 z-30 border-t border-line bg-elevated pb-[env(safe-area-inset-bottom)]",
        !model && "hidden",
      )}
      style={{ bottom: "var(--player-h)" }}
      aria-hidden={model ? undefined : true}
      aria-label={verseMode ? "Ayet dolaşımı" : "Sure dolaşımı"}
    >
      {model ? (
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2">
          {model.neighbors.previous ? (
            <Link
              className="flex min-h-11 min-w-0 max-w-[38%] items-center justify-center truncate px-3 py-2 text-sm"
              href={model.neighbors.previous.href}
            >
              ← {model.neighbors.previous.label}
            </Link>
          ) : (
            <span className="min-w-0 max-w-[38%]" />
          )}

          <QuickNav
            key={`${model.surah.number}-${model.currentAyah ?? "surah"}-${model.verseMode ? "ayet" : "sure"}`}
            current={model.surah}
            currentAyah={model.currentAyah}
          />

          {model.neighbors.next ? (
            <Link
              className="flex min-h-11 min-w-0 max-w-[38%] items-center justify-center truncate px-3 py-2 text-sm"
              href={model.neighbors.next.href}
            >
              {model.neighbors.next.label} →
            </Link>
          ) : (
            <span className="min-w-0 max-w-[38%]" />
          )}
        </div>
      ) : null}
    </nav>
  );
}
