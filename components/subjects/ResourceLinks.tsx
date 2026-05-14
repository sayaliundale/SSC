"use client";

import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { SubjectLink } from "./useSubjectWorkspace";

type ResourceLinksProps = {
    links: SubjectLink[];
    onSave: (link: Omit<SubjectLink, "id" | "createdAt">) => void;
    onDelete: (id: string) => void;
};

export function ResourceLinks({ links, onSave, onDelete }: ResourceLinksProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Quick Links</h3>
                    <p className="mt-1 text-sm text-slate-500">Save playlists, useful reads, and PYQ resources.</p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Title"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="URL"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
            </div>

            <button
                type="button"
                onClick={() => {
                    if (!title.trim() || !url.trim()) return;
                    onSave({ title: title.trim(), url: url.trim() });
                    setTitle("");
                    setUrl("");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
                <Plus size={16} />
                Save link
            </button>

            <div className="mt-6 grid gap-3">
                {links.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                        No saved links yet.
                    </div>
                ) : (
                    links.map((link) => (
                        <div key={link.id} className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <a href={link.url} target="_blank" rel="noreferrer" className="min-w-0 space-y-1">
                                <p className="text-sm font-semibold text-slate-900">{link.title}</p>
                                <p className="text-xs text-slate-500">{link.url}</p>
                            </a>
                            <div className="flex flex-col items-end gap-2 text-slate-500">
                                <ExternalLink size={16} />
                                <button type="button" onClick={() => onDelete(link.id)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
