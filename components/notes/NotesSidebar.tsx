"use client";

import { Note } from "./useNotes";
import { Plus, Trash2, Search } from "lucide-react";

const subjects = ["Quant", "English", "Reasoning", "GK"] as const;

type NotesSidebarProps = {
    notes: Note[];
    selectedNoteId: string | null;
    search: string;
    onSearchChange: (value: string) => void;
    onCreateNote: () => void;
    onSelectNote: (id: string) => void;
    onDeleteNote: (id: string) => void;
};

export function NotesSidebar({
    notes,
    selectedNoteId,
    search,
    onSearchChange,
    onCreateNote,
    onSelectNote,
    onDeleteNote,
}: NotesSidebarProps) {
    return (
        <aside className="flex h-full min-h-[calc(100vh-3rem)] flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Notes</p>
                    <p className="text-xs text-slate-500">All your study notes in one place</p>
                </div>
                <button
                    type="button"
                    onClick={onCreateNote}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    <Plus size={16} />
                    New
                </button>
            </div>

            <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search notes"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
            </label>

            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                {notes.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        No notes yet. Create one to begin.
                    </div>
                ) : (
                    notes.map((note) => {
                        const active = note._id === selectedNoteId;
                        return (
                            <button
                                key={note._id}
                                type="button"
                                onClick={() => onSelectNote(note._id)}
                                className={`group flex w-full items-start justify-between gap-3 rounded-3xl border px-4 py-4 text-left transition ${active
                                        ? "border-slate-900 bg-slate-100 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">{note.title}</p>
                                    <p className="mt-1 truncate text-xs text-slate-500">{new Date(note.updatedAt).toLocaleDateString()}</p>
                                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                        {note.subject}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDeleteNote(note._id);
                                    }}
                                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </button>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
