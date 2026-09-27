"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="bg-[#f3eee6] p-8 text-[#1b1713]">
        <h1 className="text-2xl font-semibold">Uygulama hatası</h1>
        <p className="mt-2 text-sm">{error.message}</p>
        <button type="button" className="mt-6 underline" onClick={reset}>
          Yeniden dene
        </button>
      </body>
    </html>
  );
}
