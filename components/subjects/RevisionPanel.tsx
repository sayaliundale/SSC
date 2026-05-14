"use client";

import { useState } from "react";
import { Bookmark, Sparkles, Plus, Trash2 } from "lucide-react";
import { RevisionItem } from "./useSubjectWorkspace";

type RevisionPanelProps = {
    items: RevisionItem[];
    onAdd: (item: Omit<RevisionItem, "id" | "createdAt">) => void;
    onRemove: (id: string) => void;
};

export function RevisionPanel({ items, onAdd, onRemove }: RevisionPanelProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<"Bookmark" | "Weak topic">("Bookmark");

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Revision</h3>
                    <p className="mt-1 text-sm text-slate-500">Bookmark items and track difficult topics.</p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Topic or note title"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as "Bookmark" | "Weak topic")}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                    <option value="Bookmark">Bookmark</option>
                    <option value="Weak topic">Weak topic</option>
                </select>
            </div>

            <button
                type="button"
                onClick={() => {
                    if (!title.trim()) return;
                    onAdd({ title: title.trim(), note: category === "Bookmark" ? "Review this later" : "Focus here next study session", category });
                    setTitle("");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
                <Plus size={16} />
                Add item
            </button>

            <div className="mt-6 grid gap-3">
                {items.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                        No revision items yet.
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="rounded-2xl bg-slate-200 p-2 text-slate-600">
                                        {item.category === "Bookmark" ? <Bookmark size={16} /> : <Sparkles size={16} />}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                        <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => onRemove(item.id)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
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
