export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 py-10" aria-live="polite">
      <div className="h-8 w-40 rounded-full bg-mute" />
      <div className="h-24 rounded-3xl bg-mute" />
      <div className="h-24 rounded-3xl bg-mute" />
      <p className="text-sm text-muted">Yükleniyor…</p>
    </div>
  );
}
