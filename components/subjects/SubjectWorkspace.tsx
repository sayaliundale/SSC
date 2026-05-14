"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, FileText, Link as LinkIcon, Sparkles, Clock3, Tag } from "lucide-react";
import { UploadBox } from "./UploadBox";
import { MaterialsGrid } from "./MaterialsGrid";
import { ResourceLinks } from "./ResourceLinks";
import { RevisionPanel } from "./RevisionPanel";
import { useSubjectWorkspace, SubjectKey } from "./useSubjectWorkspace";

const wireframeProgress = 72;

export function SubjectWorkspace({ subject }: { subject: SubjectKey }) {
    const {
        label,
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
    } = useSubjectWorkspace(subject);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "pdf" | "image">("all");

    const filteredMaterials = useMemo(() => {
        return workspace.materials.filter((material) => {
            const matchesFilter = filter === "all" || material.type === filter;
            const matchesSearch = material.name.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [workspace.materials, filter, search]);

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Subject workspace</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-500">Organize your notes, materials, links, and revision plan for {label}.</p>
                        </div>
                        <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            <Clock3 size={18} /> Last updated {new Date(workspace.lastStudied).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Total notes</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{totalNotes}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Total materials</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{totalMaterials}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Last studied</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{new Date(workspace.lastStudied).toLocaleDateString()}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-500">Weak topics</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{workspace.weakTopics.length}</p>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Progress</p>
                                <p className="text-2xl font-semibold text-slate-900">{wireframeProgress}%</p>
                            </div>
                            <div className="text-sm text-slate-500">Study plan steady</div>
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-slate-900" style={{ width: `${wireframeProgress}%` }} />
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">Notes</p>
                                    <p className="mt-1 text-sm text-slate-500">Quick access to notes linked to this subject.</p>
                                </div>
                                <Link href="/notes" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                                    Open notes
                                </Link>
                            </div>

                            <div className="mt-6 grid gap-3">
                                {notes.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                                        No notes found for this subject yet.
                                    </div>
                                ) : (
                                    notes.map((note) => (
                                        <Link
                                            key={note.id}
                                            href="/notes"
                                            className="group flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                                                <p className="mt-1 text-xs text-slate-500">Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                                <BookOpen size={18} />
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>

                        <div className="grid gap-6">
                            <UploadBox onUpload={addMaterials} />
                            <MaterialsGrid
                                materials={filteredMaterials}
                                search={search}
                                filter={filter}
                                onSearchChange={setSearch}
                                onFilterChange={setFilter}
                                onRemove={removeMaterial}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <ResourceLinks links={workspace.links} onSave={addLink} onDelete={removeLink} />
                        <RevisionPanel items={workspace.revision} onAdd={addRevision} onRemove={removeRevision} />
                    </div>
                </div>
            </div>
        </main>
    );
}
