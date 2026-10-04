"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { OfflinePages } from "@/features/offline/offline-pages";
import { useOnline } from "@/hooks/use-online";
import { parseAppPath, type AppRoute } from "@/lib/app-path";
import { ensureDefaultOfflinePacks } from "@/services/offline";

type OfflineContextValue = {
  path: string;
  takeover: boolean;
  route: AppRoute;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

function currentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function nativePush(url: string) {
  History.prototype.pushState.call(window.history, { ikraOffline: true }, "", url);
}

function nativeReplace(url: string) {
  History.prototype.replaceState.call(window.history, { ikraOffline: true }, "", url);
}

function shouldHandleLink(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;
  if (anchor.origin !== window.location.origin) return false;
  return true;
}

export function OfflineProvider({ children }: { children: ReactNode }) {
  const online = useOnline();
  const [takeover, setTakeover] = useState(false);
  const [path, setPath] = useState("/");
  const takeoverRef = useRef(false);

  const activate = useCallback((nextPath: string, mode: "push" | "replace" | "none") => {
    const url = nextPath || "/";
    if (mode === "push") nativePush(url);
    if (mode === "replace") nativeReplace(url);
    takeoverRef.current = true;
    setPath(url);
    setTakeover(true);
  }, []);

  useEffect(() => {
    takeoverRef.current = takeover;
  }, [takeover]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const offlineTarget = params.get("offline");
      if (offlineTarget && offlineTarget.startsWith("/")) {
        activate(offlineTarget, "replace");
      } else {
        setPath(currentPath());
      }
      void ensureDefaultOfflinePacks();
      if (navigator.storage?.persist) {
        void navigator.storage.persist();
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activate]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (online && !takeoverRef.current) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldHandleLink(anchor, event)) return;
      const next = `${anchor.pathname}${anchor.search}${anchor.hash}`;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      activate(next, "push");
    }

    function onPopState(event: PopStateEvent) {
      if (!takeoverRef.current) return;
      event.stopImmediatePropagation();
      setPath(currentPath());
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState, true);
    };
  }, [activate, online]);

  const pathname = (path.split("?")[0] ?? "/").split("#")[0] || "/";
  const route = useMemo(() => parseAppPath(pathname), [pathname]);
  const value = useMemo(
    () => ({ path: pathname, takeover, route }),
    [pathname, route, takeover],
  );

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function OfflineGate({ children }: { children: ReactNode }) {
  const context = useOfflineContext();
  if (context.takeover) {
    return <OfflinePages route={context.route} />;
  }
  return children;
}

export function useOfflinePath(): string | null {
  const context = useContext(OfflineContext);
  if (!context?.takeover) return null;
  return context.path;
}

export function useOfflineContext() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("OfflineProvider eksik.");
  }
  return context;
}
