"use client";

import { NotesList } from "@/features/library/notes-list";

export default function NotesPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Notlar</h1>
      <NotesList />
    </div>
  );
}
