'use client';

import type { VocabularyItem } from './useVocabulary';

type VocabCardProps = {
    item: VocabularyItem;
    onLearned: (id: string) => void;
    onDifficult: (id: string) => void;
    onToggleBookmark: (id: string) => void;
    onSelect?: (id: string) => void;
};

const badgeStyles = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-rose-100 text-rose-700',
};

export default function VocabCard({ item, onLearned, onDifficult, onToggleBookmark, onSelect }: VocabCardProps) {
    return (
        <article className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <button
                        type="button"
                        onClick={() => onSelect?.(item._id)}
                        className="text-left"
                    >
                        <p className="text-xl font-semibold text-slate-900">{item.word}</p>
                        <p className="mt-2 text-sm text-slate-600">{item.meaning ?? 'No meaning added yet.'}</p>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => onToggleBookmark(item._id)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border ${item.bookmarked ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-400'} transition`}
                    aria-label="Toggle bookmark"
                >
                    ★
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">{item.type}</span>
                {item.year ? <span className="rounded-full bg-slate-100 px-3 py-1">PYQ {item.year}</span> : null}
                {item.difficulty ? <span className={`rounded-full px-3 py-1 ${badgeStyles[item.difficulty]}`}>{item.difficulty}</span> : null}
                {item.mastered ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Learned</span> : null}
                {!item.mastered && item.revisionCount > 0 ? <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">Difficult</span> : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => onLearned(item._id)}
                    className="rounded-2xl bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                    Mark as learned
                </button>
                <button
                    type="button"
                    onClick={() => onDifficult(item._id)}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                    Mark as difficult
                </button>
            </div>
        </article>
    );
}
