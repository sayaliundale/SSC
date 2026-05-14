"use client";

import { useEffect, useMemo, useState } from "react";

type Subject = "Quant" | "English" | "Reasoning" | "GK";

export type Note = {
    id: string;
    title: string;
    content: string;
    subject: Subject;
    createdAt: string;
    updatedAt: string;
};

const STORAGE_KEY = "ssc_notes";

const defaultNotes: Note[] = [];

const buildNewNote = (): Note => {
    const now = new Date().toISOString();
    return {
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2, 11),
        title: "Untitled note",
        content: "<p>Start typing your note...</p>",
        subject: "Quant",
        createdAt: now,
        updatedAt: now,
    };
};

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>(defaultNotes);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as Note[];
            if (Array.isArray(parsed)) {
                setNotes(parsed);
                setSelectedNoteId(parsed[0]?.id ?? null);
            }
        } catch (error) {
            console.warn("Failed to load notes from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, [notes]);

    const selectedNote = useMemo(
        () => notes.find((note) => note.id === selectedNoteId) ?? null,
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

    const createNote = () => {
        const next = buildNewNote();
        setNotes((current) => [next, ...current]);
        setSelectedNoteId(next.id);
    };

    const deleteNote = (id: string) => {
        setNotes((current) => {
            const nextNotes = current.filter((note) => note.id !== id);
            if (selectedNoteId === id) {
                setSelectedNoteId(nextNotes[0]?.id ?? null);
            }
            return nextNotes;
        });
    };

    const updateNote = (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
        setNotes((current) =>
            current.map((note) =>
                note.id === id
                    ? {
                        ...note,
                        ...updates,
                        updatedAt: new Date().toISOString(),
                    }
                    : note
            )
        );
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
    };
}
