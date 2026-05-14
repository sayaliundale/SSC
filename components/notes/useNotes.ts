"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type Subject = "Quant" | "English" | "Reasoning" | "GK";

export type Note = {
    _id: string;
    title: string;
    content: string;
    subject: Subject;
    createdAt: string;
    updatedAt: string;
};

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/notes");
            if (!response.ok) {
                throw new Error("Failed to fetch notes");
            }
            const data = await response.json();
            setNotes(data);
            if (data.length > 0 && !selectedNoteId) {
                setSelectedNoteId(data[0]._id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [selectedNoteId]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const selectedNote = useMemo(
        () => notes.find((note) => note._id === selectedNoteId) ?? null,
        [notes, selectedNoteId]
    );

    const visibleNotes = useMemo(() => {
        if (!search.trim()) return notes;
        const query = search.toLowerCase();
        return notes.filter((note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.subject.toLowerCase().includes(query)
        );
    }, [notes, search]);

    const createNote = async () => {
        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Untitled note",
                    content: "<p>Start typing your note...</p>",
                    subject: "Quant",
                }),
            });
            if (!response.ok) throw new Error("Failed to create note");
            const newNote = await response.json();
            setNotes((current) => [newNote, ...current]);
            setSelectedNoteId(newNote._id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create note");
        }
    };

    const deleteNote = async (id: string) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete note");
            
            setNotes((current) => {
                const nextNotes = current.filter((note) => note._id !== id);
                if (selectedNoteId === id) {
                    setSelectedNoteId(nextNotes[0]?._id ?? null);
                }
                return nextNotes;
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete note");
        }
    };

    const updateNote = async (id: string, updates: Partial<Omit<Note, "_id" | "createdAt">>) => {
        // Optimistic update
        const previousNotes = [...notes];
        setNotes((current) =>
            current.map((note) =>
                note._id === id
                    ? {
                        ...note,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                    }
                    : note
            )
        );

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update note");
            const updatedNote = await response.json();
            
            setNotes((current) =>
                current.map((note) => (note._id === id ? updatedNote : note))
            );
        } catch (err) {
            setNotes(previousNotes); // Rollback
            setError(err instanceof Error ? err.message : "Failed to update note");
        }
    };

    return {
        notes: visibleNotes,
        selectedNote,
        selectedNoteId,
        search,
        setSearch,
        createNote,
        deleteNote,
        setSelectedNoteId,
        updateNote,
        loading,
        error,
    };
}

