'use client';

import { useMemo, useState } from 'react';
import type { VocabularyItem } from './useVocabulary';

type VocabListProps = {
    items: VocabularyItem[];
    selectedId?: string;
    onSelect: (id: string) => void;
};

const badgeStyle = {
    synonym: 'bg-slate-100 text-slate-700',
    antonym: 'bg-slate-100 text-slate-700',
    idiom: 'bg-slate-100 text-slate-700',
    'one-word': 'bg-slate-100 text-slate-700',
};

export default function VocabList({ items, selectedId, onSelect }: VocabListProps) {
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [masteredFilter, setMasteredFilter] = useState('all');

    const filteredItems = useMemo(() => {
        return items
            .filter((item) => {
                if (query && !item.word.toLowerCase().includes(query.toLowerCase())) return false;
                if (typeFilter !== 'all' && item.type !== typeFilter) return false;
                if (difficultyFilter !== 'all' && item.difficulty !== difficultyFilter) return false;
                if (masteredFilter !== 'all') {
                    return masteredFilter === 'mastered' ? item.mastered : !item.mastered;
                }
                return true;
            })
            .sort((a, b) => a.word.localeCompare(b.word));
    }, [items, query, typeFilter, difficultyFilter, masteredFilter]);

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500">All Vocabulary</p>
                    <h2 className="text-2xl font-semibold text-slate-900">Search, filter, and review</h2>
                </div>
                <p className="text-sm text-slate-500">{filteredItems.length} items found</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="space-y-2 text-sm text-slate-700">
                    Search
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by word"
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                    Type
                    <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="all">All</option>
                        <option value="synonym">Synonym</option>
                        <option value="antonym">Antonym</option>
                        <option value="idiom">Idiom</option>
                        <option value="one-word">One-word</option>
                    </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                    Difficulty
                    <select
                        value={difficultyFilter}
                        onChange={(event) => setDifficultyFilter(event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="all">All</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                    Mastery
                    <select
                        value={masteredFilter}
                        onChange={(event) => setMasteredFilter(event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="all">All</option>
                        <option value="mastered">Mastered</option>
                        <option value="not-mastered">Not mastered</option>
                    </select>
                </label>
            </div>

            <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200">
                <div className="grid gap-0 bg-slate-50 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-500 sm:grid-cols-[2fr_1fr_1fr_1fr]">
                    <span>Word</span>
                    <span>Type</span>
                    <span>Difficulty</span>
                    <span>Status</span>
                </div>
                <div className="divide-y divide-slate-200 bg-white">
                    {filteredItems.map((item) => (
                        <button
                            key={item._id}
                            type="button"
                            onClick={() => onSelect(item._id)}
                            className={`w-full px-4 py-4 text-left transition hover:bg-slate-50 ${selectedId === item._id ? 'bg-slate-100' : ''}`}
                        >
                            <div className="grid gap-0 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr]">
                                <div>
                                    <p className="font-semibold text-slate-900">{item.word}</p>
                                    <p className="mt-1 text-xs text-slate-500">{item.example ?? item.meaning}</p>
                                </div>
                                <span className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-semibold ${badgeStyle[item.type]}`}>
                                    {item.type}
                                </span>
                                <span className="text-sm text-slate-700">{item.difficulty ?? 'medium'}</span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {item.mastered ? 'Mastered' : 'Learning'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
