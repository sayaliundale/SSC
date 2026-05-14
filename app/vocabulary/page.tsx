'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVocabulary } from '../../components/vocabulary/useVocabulary';
import DailyVocab from '../../components/vocabulary/DailyVocab';
import VocabList from '../../components/vocabulary/VocabList';
import VocabDetail from '../../components/vocabulary/VocabDetail';

export default function VocabularyPage() {
    const {
        items,
        dailyVocab,
        bookmarkCount,
        revisionDueCount,
        toggleBookmark,
        markAsLearned,
        markAsDifficult,
    } = useVocabulary();

    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedId && items.length > 0) {
            setSelectedId(items[0]._id);
        }
    }, [items, selectedId]);

    const selectedItem = items.find((item) => item._id === selectedId) ?? items[0];

    return (
        <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Vocabulary Engine</p>
                        <h1 className="text-3xl font-semibold text-slate-900">Build stronger word skills</h1>
                        <p className="mt-3 max-w-2xl text-slate-600">
                            Review daily vocabulary, browse your full list, and keep revision tasks in sync with the dashboard.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-3xl bg-slate-50 px-5 py-4 text-center">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bookmarks</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{bookmarkCount}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 px-5 py-4 text-center">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Revision due</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{revisionDueCount}</p>
                        </div>
                        <Link href="/vocabulary/import" className="rounded-3xl bg-slate-900 px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
                            Import words
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                <DailyVocab
                    items={dailyVocab}
                    onLearned={markAsLearned}
                    onDifficult={markAsDifficult}
                    onToggleBookmark={toggleBookmark}
                    onSelect={setSelectedId}
                />
                <VocabDetail
                    item={selectedItem}
                    onLearned={markAsLearned}
                    onDifficult={markAsDifficult}
                    onToggleBookmark={toggleBookmark}
                />
            </div>

            <VocabList items={items} selectedId={selectedId ?? undefined} onSelect={setSelectedId} />
        </section>
    );
}
