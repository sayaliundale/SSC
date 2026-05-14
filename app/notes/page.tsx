"use client";

import { NoteEditor } from "../../components/notes/NoteEditor";
import { NotesSidebar } from "../../components/notes/NotesSidebar";
import { useNotes } from "../../components/notes/useNotes";

export default function NotesPage() {
    const {
        notes,
        selectedNote,
        selectedNoteId,
        search,
        setSearch,
        createNote,
        deleteNote,
        setSelectedNoteId,
        updateNote,
        loading,
        error
    } = useNotes();

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 p-8 text-center">
                <div className="max-w-md rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
                    <p className="text-xl font-semibold text-red-700">Error</p>
                    <p className="mt-2 text-slate-600">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-6 rounded-2xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-[1500px] gap-6">
                <div className="w-full max-w-[420px]">
                    <NotesSidebar
                        notes={notes}
                        selectedNoteId={selectedNoteId}
                        search={search}
                        onSearchChange={setSearch}
                        onCreateNote={createNote}
                        onSelectNote={setSelectedNoteId}
                        onDeleteNote={deleteNote}
                    />
                </div>

                <div className="flex-1">
                    <NoteEditor note={selectedNote} onUpdateNote={updateNote} onDeleteNote={deleteNote} />
                </div>
            </div>
        </main>
    );
}
