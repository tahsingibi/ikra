"use client";

import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type DropdownProps = {
  trigger: ReactNode;
  align?: "start" | "end" | "center";
  width?: number;
  children: ReactNode;
  className?: string;
  placement?: "absolute" | "fixed-bottom";
};

export function Dropdown({
  trigger,
  align = "end",
  width = 280,
  children,
  className,
  placement = "absolute",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  // Outside click / touch dinleyicisi
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const container = containerRef.current;
      if (!container) return;

      // Eğer tıklanan yer dropdown kapsayıcısının (trigger veya menü) içindeyse kapatma
      if (container.contains(target)) {
        return;
      }

      // Dışarı tıklandı -> menüyü kapat
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  // Menü içindeki link veya eylem butonlarına tıklandığında menüyü kapat
  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Form alanlarına (textarea, input, select) tıklandığında menüyü kapatma
    if (target.closest("textarea, input, select, form label")) {
      return;
    }

    if (target.closest("a, button, [role='menuitem'], [data-dropdown-close]")) {
      close();
    }
  };

  const alignmentClass =
    align === "start"
      ? "left-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "right-0";

  const placementClass =
    placement === "fixed-bottom"
      ? "fixed bottom-[calc(var(--player-h,0px)+3.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[min(340px,calc(100vw-1.5rem))] max-h-[65vh]"
      : `absolute top-full mt-2 ${alignmentClass} w-[min(${width}px,calc(100vw-1.5rem))] max-h-[70vh]`;

  // Trigger elementi React elementi ise doğrudan handler ve accessibility özniteliklerini bağlıyoruz
  const triggerNode = isValidElement(trigger) ? (
    cloneElement(trigger as ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      "aria-haspopup"?: string;
      "aria-expanded"?: boolean;
    }>, {
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: (e: React.MouseEvent) => {
        (trigger as ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props.onClick?.(e);
        toggle();
      },
    })
  ) : (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
      className="inline-flex items-center justify-center"
    >
      {trigger}
    </button>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", open && "z-[100]")}
    >
      {triggerNode}

      {open && (
        <div
          role="menu"
          onClick={handleMenuClick}
          className={cn(
            "z-[100] overflow-y-auto rounded-2xl border border-line bg-elevated p-2 shadow-2xl transition-all",
            placementClass,
            className,
          )}
          style={{
            maxWidth: "calc(100vw - 1.5rem)",
            width: placement === "absolute" ? `min(${width}px, calc(100vw - 1.5rem))` : undefined,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}