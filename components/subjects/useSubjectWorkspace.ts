"use client";

import { useEffect, useMemo, useState } from "react";

export type SubjectKey = "quant" | "english" | "reasoning" | "gk";

export type SubjectMaterial = {
    id: string;
    name: string;
    type: "pdf" | "image";
    uploadedAt: string;
};

export type SubjectLink = {
    id: string;
    title: string;
    url: string;
    createdAt: string;
};

export type RevisionItem = {
    id: string;
    title: string;
    note: string;
    category: "Bookmark" | "Weak topic";
    createdAt: string;
};

export type SubjectWorkspaceData = {
    materials: SubjectMaterial[];
    links: SubjectLink[];
    revision: RevisionItem[];
    lastStudied: string;
    weakTopics: string[];
};

export const SUBJECT_KEYS: SubjectKey[] = ["quant", "english", "reasoning", "gk"];

export const SUBJECT_LABELS: Record<SubjectKey, string> = {
    quant: "Quant",
    english: "English",
    reasoning: "Reasoning",
    gk: "GK",
};

const STORAGE_KEYS: Record<SubjectKey, string> = {
    quant: "ssc_subject_quant",
    english: "ssc_subject_english",
    reasoning: "ssc_subject_reasoning",
    gk: "ssc_subject_gk",
};

const subjectNoteKey = (subject: SubjectKey) => STORAGE_KEYS[subject];

const generateId = () => `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;

const createDefaultWorkspace = (subject: SubjectKey): SubjectWorkspaceData => ({
    materials: [],
    links: [],
    revision: [
        {
            id: generateId(),
            title: "Review recent mock test",
            note: "Pin the hardest questions for the next study session.",
            category: "Bookmark",
            createdAt: new Date().toISOString(),
        },
        {
            id: generateId(),
            title: "Weak topic: Speed & Distance",
            note: "Practice shortcuts and formula recall.",
            category: "Weak topic",
            createdAt: new Date().toISOString(),
        },
    ],
    lastStudied: new Date().toISOString(),
    weakTopics: ["Time management", "Grammar rules", "Logical puzzles"],
});

const loadNotes = (subject: SubjectKey) => {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem("ssc_notes");
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Array<{ id: string; title: string; subject: string; updatedAt: string }>;
        const subjectLabel = SUBJECT_LABELS[subject];
        return parsed
            .filter((note) => note.subject === subjectLabel)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 6);
    } catch {
        return [];
    }
};

export function useSubjectWorkspace(subject: SubjectKey) {
    const [workspace, setWorkspace] = useState<SubjectWorkspaceData>(() => createDefaultWorkspace(subject));
    const [notes, setNotes] = useState(loadNotes(subject));

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(subjectNoteKey(subject));
            if (raw) {
                setWorkspace(JSON.parse(raw) as SubjectWorkspaceData);
            } else {
                const initial = createDefaultWorkspace(subject);
                window.localStorage.setItem(subjectNoteKey(subject), JSON.stringify(initial));
                setWorkspace(initial);
            }
        } catch {
            setWorkspace(createDefaultWorkspace(subject));
        }

        setNotes(loadNotes(subject));
    }, [subject]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(subjectNoteKey(subject), JSON.stringify(workspace));
    }, [subject, workspace]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "ssc_notes" && event.newValue) {
                setNotes(loadNotes(subject));
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [subject]);

    const addMaterials = (files: FileList) => {
        const uploads: SubjectMaterial[] = Array.from(files).map((file) => ({
            id: generateId(),
            name: file.name,
            type: file.type.includes("pdf") ? "pdf" : "image",
            uploadedAt: new Date().toISOString(),
        }));
        setWorkspace((current) => ({
            ...current,
            materials: [...uploads, ...current.materials],
            lastStudied: new Date().toISOString(),
        }));
    };

    const removeMaterial = (id: string) => {
        setWorkspace((current) => ({
            ...current,
            materials: current.materials.filter((item) => item.id !== id),
        }));
    };

    const addLink = (link: Omit<SubjectLink, "id" | "createdAt">) => {
        const next: SubjectLink = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...link,
        };
        setWorkspace((current) => ({
            ...current,
            links: [next, ...current.links],
        }));
    };

    const removeLink = (id: string) => {
        setWorkspace((current) => ({
            ...current,
            links: current.links.filter((item) => item.id !== id),
        }));
    };

    const addRevision = (revision: Omit<RevisionItem, "id" | "createdAt">) => {
        const next: RevisionItem = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...revision,
        };
        setWorkspace((current) => ({
            ...current,
            revision: [next, ...current.revision],
        }));
    };

    const removeRevision = (id: string) => {
        setWorkspace((current) => ({
            ...current,
            revision: current.revision.filter((item) => item.id !== id),
        }));
    };

    const totalNotes = useMemo(() => notes.length, [notes]);
    const totalMaterials = useMemo(() => workspace.materials.length, [workspace.materials]);

    return {
        subject,
        label: SUBJECT_LABELS[subject],
        workspace,
        notes,
        totalNotes,
        totalMaterials,
        addMaterials,
        removeMaterial,
        addLink,
        removeLink,
        addRevision,
        removeRevision,
    };
}
