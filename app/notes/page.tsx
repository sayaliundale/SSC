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
    } = useNotes();

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
