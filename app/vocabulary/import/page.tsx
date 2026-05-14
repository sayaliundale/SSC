'use client';

import { useVocabulary } from '../../../components/vocabulary/useVocabulary';
import ImportBox from '../../../components/vocabulary/ImportBox';
import Link from 'next/link';

export default function VocabularyImportPage() {
    const { addItems, items } = useVocabulary();

    return (
        <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Vocabulary Import</p>
                        <h1 className="text-3xl font-semibold text-slate-900">Paste word pairs to import</h1>
                        <p className="mt-3 max-w-2xl text-slate-600">
                            Paste entries like <span className="font-semibold">Abandon - Forsake</span> and convert them into structured study cards.
                        </p>
                    </div>
                    <Link href="/vocabulary" className="rounded-3xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
                        Back to vocabulary
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
                <ImportBox onImport={addItems} />
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Vocabulary Library</h2>
                    <p className="mt-3 text-sm text-slate-600">You currently have {items.length} stored words.</p>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Import tips</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                                <li>One entry per line.</li>
                                <li>Use <span className="font-semibold">-</span> or <span className="font-semibold">:</span> between word and meaning.</li>
                                <li>Imported terms will default to synonym type.</li>
                            </ul>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Next step</p>
                            <p className="mt-2 text-sm text-slate-600">After import, return to the main vocabulary page to review and mark difficult or learned items.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
