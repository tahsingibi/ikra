import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-muted">Aradığın sure veya ayet yok.</p>
      <Link href="/sureler" className="mt-6 inline-block text-accent">
        Surelere dön
      </Link>
    </div>
  );
}
