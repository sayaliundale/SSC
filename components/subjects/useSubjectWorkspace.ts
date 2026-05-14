"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

const generateId = () => `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;

const createDefaultWorkspace = (): SubjectWorkspaceData => ({
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

export function useSubjectWorkspace(subject: SubjectKey) {
    const [workspace, setWorkspace] = useState<SubjectWorkspaceData>(createDefaultWorkspace());
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch workspace data
            const wsResponse = await fetch(`/api/subjects/${subject}`);
            if (!wsResponse.ok) throw new Error("Failed to fetch workspace");
            const wsData = await wsResponse.json();
            setWorkspace(wsData);

            // Fetch notes for this subject
            const notesResponse = await fetch("/api/notes");
            if (!notesResponse.ok) throw new Error("Failed to fetch notes");
            const allNotes = await notesResponse.json();
            const subjectLabel = SUBJECT_LABELS[subject];
            const filteredNotes = allNotes
                .filter((note: any) => note.subject === subjectLabel)
                .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 6);
            setNotes(filteredNotes);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [subject]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const saveWorkspace = async (updatedWs: SubjectWorkspaceData) => {
        try {
            const response = await fetch(`/api/subjects/${subject}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedWs),
            });
            if (!response.ok) throw new Error("Failed to save workspace");
            const data = await response.json();
            setWorkspace(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save workspace");
        }
    };

    const addMaterials = (files: FileList) => {
        const uploads: SubjectMaterial[] = Array.from(files).map((file) => ({
            id: generateId(),
            name: file.name,
            type: file.type.includes("pdf") ? "pdf" : "image",
            uploadedAt: new Date().toISOString(),
        }));
        const next = {
            ...workspace,
            materials: [...uploads, ...workspace.materials],
            lastStudied: new Date().toISOString(),
        };
        saveWorkspace(next);
    };

    const removeMaterial = (id: string) => {
        const next = {
            ...workspace,
            materials: workspace.materials.filter((item) => item.id !== id),
        };
        saveWorkspace(next);
    };

    const addLink = (link: Omit<SubjectLink, "id" | "createdAt">) => {
        const next: SubjectLink = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...link,
        };
        const updated = {
            ...workspace,
            links: [next, ...workspace.links],
        };
        saveWorkspace(updated);
    };

    const removeLink = (id: string) => {
        const next = {
            ...workspace,
            links: workspace.links.filter((item) => item.id !== id),
        };
        saveWorkspace(next);
    };

    const addRevision = (revision: Omit<RevisionItem, "id" | "createdAt">) => {
        const next: RevisionItem = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...revision,
        };
        const updated = {
            ...workspace,
            revision: [next, ...workspace.revision],
        };
        saveWorkspace(updated);
    };

    const removeRevision = (id: string) => {
        const next = {
            ...workspace,
            revision: workspace.revision.filter((item) => item.id !== id),
        };
        saveWorkspace(next);
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
        loading,
        error,
        addMaterials,
        removeMaterial,
        addLink,
        removeLink,
        addRevision,
        removeRevision,
    };
}

