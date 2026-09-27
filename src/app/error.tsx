"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16">
      <h1 className="text-2xl font-semibold">Bir şeyler ters gitti</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <button
        type="button"
        className="mt-6 rounded-full bg-accent px-4 py-2 text-[var(--bg)]"
        onClick={reset}
      >
        Yeniden dene
      </button>
    </div>
  );
}
