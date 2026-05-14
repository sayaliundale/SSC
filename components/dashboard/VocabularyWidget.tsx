'use client';

import Link from 'next/link';
import { useVocabulary } from '../vocabulary/useVocabulary';
import WidgetCard from './WidgetCard';

const badgeClass = (type: string) => {
    switch (type) {
        case 'synonym':
            return 'bg-slate-100 text-slate-700';
        case 'antonym':
            return 'bg-slate-100 text-slate-700';
        case 'idiom':
            return 'bg-slate-100 text-slate-700';
        case 'one-word':
            return 'bg-slate-100 text-slate-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

export default function VocabularyWidget() {
    const { dailyVocab, bookmarkCount, revisionDueCount } = useVocabulary();
    const preview = dailyVocab.slice(0, 3);

    return (
        <WidgetCard title="Today’s Vocabulary" subtitle="Your daily learning and revision list">
            <div className="space-y-4">
                {preview.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                        No vocabulary selected for today.
                    </div>
                ) : (
                    preview.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{item.word}</p>
                                <p className="mt-1 text-sm text-slate-600">{item.synonym ?? item.meaning ?? 'Flashcard'}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(item.type)}`}>{item.type}</span>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Bookmarks</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{bookmarkCount}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Revision due</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{revisionDueCount}</p>
                </div>
                <Link href="/vocabulary" className="rounded-3xl bg-slate-900 px-4 py-4 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
                    Open Vocabulary
                </Link>
            </div>
        </WidgetCard>
    );
}
