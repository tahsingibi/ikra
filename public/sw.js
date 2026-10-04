const VERSION = "ikra-v2";
const PRECACHE = [
  "/",
  "/sureler",
  "/nuzul",
  "/cuz",
  "/sayfa",
  "/ara",
  "/ayarlar",
  "/cevrimdisi",
  "/notlar",
  "/favoriler",
  "/yer-imleri",
  "/plan",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable.png",
  "/data/manifest.json",
  "/data/quran-uthmani.json",
  "/data/transliteration-tr-abay.json",
  "/data/translation-tr-diyanet.json",
  "/data/translation-tr-yazir.json",
  "/data/translation-tr-vakfi.json",
  "/data/tafsir-tr-mokhtasar.json",
  "/data/tafsir-tr-ibnkathir.json",
  "/data/tafsir-ar-jalalayn.json",
  "/data/tafsir-ar-muyassar.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      await precacheAll(cache, PRECACHE);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith("/data/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/fonts/")
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigate(request, url));
    return;
  }

  if (isRscRequest(request, url) || url.pathname.startsWith("/_next/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

function isRscRequest(request, url) {
  return request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
}

async function handleNavigate(request, url) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(VERSION);
    cache.put(pageKey(url), response.clone());
    await cachePageAssets(cache, response.clone());
    return response;
  } catch {
    const cached =
      (await caches.match(request, { ignoreSearch: true })) ||
      (await caches.match(pageKey(url))) ||
      (url.pathname === "/" ? await caches.match("/") : null);
    if (cached) return cached;
    if (url.pathname !== "/") {
      const target = `${url.pathname}${url.search}`;
      return Response.redirect(
        new URL(`/?offline=${encodeURIComponent(target)}`, url.origin),
        302,
      );
    }
    return new Response("Çevrimdışı içerik henüz hazır değil.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 503, statusText: "Offline" });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("", { status: 503, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(VERSION);
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  return cached || network;
}

function pageKey(url) {
  return new URL(url.pathname, url.origin).toString();
}

async function precacheAll(cache, urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) continue;
      await cache.put(url, response.clone());
      await cachePageAssets(cache, response);
    } catch {
      // Skip missing optional assets so install still completes.
    }
  }
}

async function cachePageAssets(cache, response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return;
  const html = await response.text();
  const assets = new Set();
  const pattern = /(?:src|href)=["']([^"']+)["']/g;
  let match;
  while ((match = pattern.exec(html))) {
    const value = match[1].split("?")[0];
    if (
      value.startsWith("/_next/") ||
      value.startsWith("/icons/") ||
      value.startsWith("/fonts/")
    ) {
      assets.add(value);
    }
  }
  await Promise.all(
    [...assets].map(async (asset) => {
      if (await caches.match(asset)) return;
      try {
        const assetResponse = await fetch(asset, { credentials: "same-origin" });
        if (assetResponse.ok) await cache.put(asset, assetResponse);
      } catch {
        // Asset may be hashed and already cached under another key.
      }
    }),
  );
}
