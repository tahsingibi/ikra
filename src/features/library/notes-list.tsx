"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import { listNotes } from "@/services/library";
import type { Note } from "@/types/quran";

export function NotesList() {
  const [items, setItems] = useState<Note[]>([]);
  useEffect(() => {
    void listNotes().then(setItems);
  }, []);

  if (items.length === 0) {
    return <p className="text-muted">Kayıtlı not yok.</p>;
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl border border-line p-4">
          <Link href={versePath(item.surah, item.ayah)} className="text-sm text-muted">
            {getSurah(item.surah)?.name} {item.ayah}
          </Link>
          <p className="mt-2 whitespace-pre-wrap">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
