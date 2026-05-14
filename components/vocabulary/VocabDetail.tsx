'use client';

import type { VocabularyItem } from './useVocabulary';

type VocabDetailProps = {
    item?: VocabularyItem;
    onLearned: (id: string) => void;
    onDifficult: (id: string) => void;
    onToggleBookmark: (id: string) => void;
};

const badgeStyles = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-rose-100 text-rose-700',
};

export default function VocabDetail({ item, onLearned, onDifficult, onToggleBookmark }: VocabDetailProps) {
    if (!item) {
        return (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-center text-slate-500">
                    <p className="text-lg font-semibold text-slate-900">Select a word</p>
                    <p className="mt-2 text-sm">Click any vocabulary item to view full details and revision history.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500">Word Detail</p>
                    <h2 className="text-2xl font-semibold text-slate-900">{item.word}</h2>
                    <p className="mt-2 text-sm text-slate-600">{item.meaning ?? 'Meaning unavailable.'}</p>
                </div>
                <button
                    type="button"
                    onClick={() => onToggleBookmark(item._id)}
                    className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${item.bookmarked ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                    {item.bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Type</p>
                    <p className="text-base font-semibold text-slate-900">{item.type}</p>
                </div>
                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Difficulty</p>
                    <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${item.difficulty ? badgeStyles[item.difficulty] : 'bg-slate-100 text-slate-700'}`}>{item.difficulty ?? 'medium'}</p>
                </div>
                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Revision count</p>
                    <p className="text-base font-semibold text-slate-900">{item.revisionCount}</p>
                </div>
                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Last reviewed</p>
                    <p className="text-base font-semibold text-slate-900">{item.lastReviewed ?? 'Not reviewed yet'}</p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Synonym</p>
                    <p className="mt-2 text-sm text-slate-700">{item.synonym ?? 'N/A'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Antonym</p>
                    <p className="mt-2 text-sm text-slate-700">{item.antonym ?? 'N/A'}</p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => onLearned(item._id)}
                    className="rounded-2xl bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                    Mark as learned
                </button>
                <button
                    type="button"
                    onClick={() => onDifficult(item._id)}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                    Mark as difficult
                </button>
            </div>
        </section>
    );
}
