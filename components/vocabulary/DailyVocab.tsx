'use client';

import type { VocabularyItem } from './useVocabulary';
import VocabCard from './VocabCard';

type DailyVocabProps = {
    items: VocabularyItem[];
    onLearned: (id: string) => void;
    onDifficult: (id: string) => void;
    onToggleBookmark: (id: string) => void;
    onSelect: (id: string) => void;
};

export default function DailyVocab({ items, onLearned, onDifficult, onToggleBookmark, onSelect }: DailyVocabProps) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500">Daily Vocabulary Feed</p>
                    <h2 className="text-2xl font-semibold text-slate-900">Today’s words</h2>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {items.length} words selected
                </div>
            </div>

            {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                    No words are scheduled for today. Add vocabulary or import new items.
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <VocabCard
                            key={item.id}
                            item={item}
                            onLearned={onLearned}
                            onDifficult={onDifficult}
                            onToggleBookmark={onToggleBookmark}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
