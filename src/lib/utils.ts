export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}

export function verseId(surah: number, ayah: number): `${number}:${number}` {
  return `${surah}:${ayah}`;
}

export function parseVerseId(id: string): { surah: number; ayah: number } {
  const [surah, ayah] = id.split(":").map(Number);
  return { surah, ayah };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function turkishIncludes(haystack: string, needle: string): boolean {
  return haystack
    .toLocaleLowerCase("tr-TR")
    .includes(needle.trim().toLocaleLowerCase("tr-TR"));
}

export function snippetAround(text: string, query: string, radius = 80): string {
  const lower = text.toLocaleLowerCase("tr-TR");
  const q = query.trim().toLocaleLowerCase("tr-TR");
  const index = lower.indexOf(q);
  if (index === -1) {
    return text.length > radius * 2 ? `${text.slice(0, radius * 2)}…` : text;
  }
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + q.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

export function isoDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * RFC4122 standardına uygun UUID v4 üretici.
 * Web Cryptography API non-secure context'lerde (HTTP üzerinden yerel IP/LAN erişimi)
 * `crypto.randomUUID` sağlamaz; bu durumlarda matematiksel fallback çalışır.
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function deviceId(): string {
  if (typeof window === "undefined") return "server";
  const key = "ikra.device-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = generateUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function shareOrCopy(data: {
  title: string;
  text: string;
  url: string;
}): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    return navigator
      .share(data)
      .then(() => "shared" as const)
      .catch(async () => {
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        return "copied" as const;
      });
  }
  return navigator.clipboard
    .writeText(`${data.text}\n${data.url}`)
    .then(() => "copied" as const);
}
