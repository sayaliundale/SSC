"use client";

import { useEffect, useState } from "react";
import { BarChart3, BookOpen, Brain, Globe2 } from "lucide-react";
import { SubjectCard } from "../../components/subjects/SubjectCard";
import { SubjectKey, SUBJECT_LABELS } from "../../components/subjects/useSubjectWorkspace";

const subjectConfig: Array<{ key: SubjectKey; icon: any; progress: number }> = [
    { key: "quant", icon: BarChart3, progress: 72 },
    { key: "english", icon: BookOpen, progress: 58 },
    { key: "reasoning", icon: Brain, progress: 64 },
    { key: "gk", icon: Globe2, progress: 81 },
];

type SubjectStats = Record<SubjectKey, { notes: number; materials: number }>;

const defaultStats: SubjectStats = {
    quant: { notes: 0, materials: 0 },
    english: { notes: 0, materials: 0 },
    reasoning: { notes: 0, materials: 0 },
    gk: { notes: 0, materials: 0 },
};

export default function SubjectsPage() {
    const [stats, setStats] = useState<SubjectStats>(defaultStats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                setLoading(true);
                // Fetch all notes to count them by subject
                const notesRes = await fetch("/api/notes");
                const allNotes = notesRes.ok ? await notesRes.json() : [];

                const counts: SubjectStats = JSON.parse(JSON.stringify(defaultStats));

                // Map notes to subjects
                allNotes.forEach((note: any) => {
                    const key = Object.entries(SUBJECT_LABELS).find(([, label]) => label === note.subject)?.[0] as SubjectKey | undefined;
                    if (key && counts[key]) {
                        counts[key].notes += 1;
                    }
                });

                // Fetch each subject workspace to get material counts
                for (const subject of subjectConfig) {
                    const wsRes = await fetch(`/api/subjects/${subject.key}`);
                    if (wsRes.ok) {
                        const wsData = await wsRes.json();
                        counts[subject.key].materials = wsData.materials?.length ?? 0;
                    }
                }

                setStats(counts);
            } catch (error) {
                console.error("Failed to fetch subject stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1500px] space-y-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Study spaces</p>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Subject dashboard</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-500">Choose a subject workspace to organize your materials, notes, and revision plan.</p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {subjectConfig.map((subject) => (
                        <SubjectCard
                            key={subject.key}
                            subjectKey={subject.key}
                            title={SUBJECT_LABELS[subject.key]}
                            icon={subject.icon}
                            notes={stats[subject.key].notes}
                            materials={stats[subject.key].materials}
                            progress={subject.progress}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

