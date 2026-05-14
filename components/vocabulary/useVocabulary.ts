'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type VocabType = 'synonym' | 'antonym' | 'idiom' | 'one-word';
export type VocabSource = 'PYQ' | 'manual' | 'imported';
export type VocabDifficulty = 'easy' | 'medium' | 'hard';

export type VocabularyItem = {
    id: string;
    word: string;
    type: VocabType;
    meaning?: string;
    synonym?: string;
    antonym?: string;
    example?: string;
    source?: VocabSource;
    year?: number;
    difficulty?: VocabDifficulty;
    mastered: boolean;
    bookmarked: boolean;
    revisionCount: number;
    lastReviewed?: string;
};

const STORAGE_KEY = 'ssc_vocab_data';

const todayString = () => new Date().toISOString().slice(0, 10);

const defaultVocabulary: VocabularyItem[] = [
    {
        id: 'vocab-1',
        word: 'Abandon',
        type: 'synonym',
        meaning: 'Give up completely',
        synonym: 'Forsake',
        antonym: 'Retain',
        example: 'She had to abandon the plan after the setback.',
        source: 'PYQ',
        year: 2023,
        difficulty: 'medium',
        mastered: false,
        bookmarked: true,
        revisionCount: 1,
        lastReviewed: '2026-05-10',
    },
    {
        id: 'vocab-2',
        word: 'Candid',
        type: 'synonym',
        meaning: 'Truthful and straightforward',
        synonym: 'Frank',
        antonym: 'Evasive',
        example: 'He was candid about his past.',
        source: 'manual',
        difficulty: 'easy',
        mastered: true,
        bookmarked: false,
        revisionCount: 2,
        lastReviewed: '2026-05-08',
    },
    {
        id: 'vocab-3',
        word: 'Break the ice',
        type: 'idiom',
        meaning: 'Make people feel more comfortable',
        synonym: 'Initiate conversation',
        example: 'He told a joke to break the ice.',
        source: 'manual',
        difficulty: 'easy',
        mastered: false,
        bookmarked: false,
        revisionCount: 0,
    },
    {
        id: 'vocab-4',
        word: 'Peripheral',
        type: 'one-word',
        meaning: 'Related to the outer edge',
        synonym: 'Marginal',
        antonym: 'Central',
        example: 'The issue was peripheral to the main problem.',
        source: 'manual',
        difficulty: 'medium',
        mastered: false,
        bookmarked: false,
        revisionCount: 0,
    },
    {
        id: 'vocab-5',
        word: 'Apathetic',
        type: 'antonym',
        meaning: 'Showing little emotion or interest',
        synonym: 'Indifferent',
        antonym: 'Passionate',
        example: 'The audience remained apathetic.',
        source: 'PYQ',
        year: 2024,
        difficulty: 'hard',
        mastered: false,
        bookmarked: true,
        revisionCount: 2,
        lastReviewed: '2026-05-11',
    },
    {
        id: 'vocab-6',
        word: 'Concur',
        type: 'synonym',
        meaning: 'Agree with someone or something',
        synonym: 'Agree',
        antonym: 'Disagree',
        example: 'Most experts concur with the findings.',
        source: 'manual',
        difficulty: 'easy',
        mastered: true,
        bookmarked: false,
        revisionCount: 3,
        lastReviewed: '2026-05-07',
    },
    {
        id: 'vocab-7',
        word: 'Vindicate',
        type: 'one-word',
        meaning: 'Clear from blame or suspicion',
        synonym: 'Exonerate',
        antonym: 'Convict',
        example: 'The evidence served to vindicate her.',
        source: 'manual',
        difficulty: 'hard',
        mastered: false,
        bookmarked: false,
        revisionCount: 0,
    },
    {
        id: 'vocab-8',
        word: 'Perplex',
        type: 'synonym',
        meaning: 'Cause to be puzzled',
        synonym: 'Baffle',
        antonym: 'Clarify',
        example: 'The question perplexed the students.',
        source: 'manual',
        difficulty: 'medium',
        mastered: false,
        bookmarked: false,
        revisionCount: 0,
    },
];

const loadStorage = (): VocabularyItem[] => {
    if (typeof window === 'undefined') return defaultVocabulary;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as VocabularyItem[]) : defaultVocabulary;
    } catch {
        return defaultVocabulary;
    }
};

const saveStorage = (items: VocabularyItem[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const normalizeDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const daysSince = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date(todayString());
    const diff = today.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const needsReview = (item: VocabularyItem) => {
    if (!item.lastReviewed) {
        return item.revisionCount > 0 || !item.mastered;
    }

    const days = daysSince(item.lastReviewed);

    if (item.mastered) {
        return days >= 3;
    }

    return item.revisionCount > 0 && days >= 1;
};

const createId = () => `vocab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function useVocabulary() {
    const [items, setItems] = useState<VocabularyItem[]>([]);

    useEffect(() => {
        setItems(loadStorage());
    }, []);

    useEffect(() => {
        if (items.length > 0) saveStorage(items);
    }, [items]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) {
                setItems(loadStorage());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const addItem = useCallback(
        (item: Omit<VocabularyItem, 'id' | 'mastered' | 'bookmarked' | 'revisionCount' | 'lastReviewed'>) => {
            setItems((current) => [
                ...current,
                {
                    ...item,
                    id: createId(),
                    mastered: false,
                    bookmarked: false,
                    revisionCount: 0,
                },
            ]);
        },
        []
    );

    const addItems = useCallback(
        (newItems: Array<Omit<VocabularyItem, 'id' | 'mastered' | 'bookmarked' | 'revisionCount' | 'lastReviewed'>>) => {
            setItems((current) => [
                ...current,
                ...newItems.map((item) => ({
                    ...item,
                    id: createId(),
                    mastered: false,
                    bookmarked: false,
                    revisionCount: 0,
                })),
            ]);
        },
        []
    );

    const updateItem = useCallback((id: string, updates: Partial<Omit<VocabularyItem, 'id'>>) => {
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    }, []);

    const toggleBookmark = useCallback((id: string) => {
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, bookmarked: !item.bookmarked } : item))
        );
    }, []);

    const markAsLearned = useCallback((id: string) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        mastered: true,
                        revisionCount: item.revisionCount + 1,
                        lastReviewed: todayString(),
                    }
                    : item
            )
        );
    }, []);

    const markAsDifficult = useCallback((id: string) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        mastered: false,
                        revisionCount: item.revisionCount + 1,
                        lastReviewed: todayString(),
                        difficulty: 'hard',
                    }
                    : item
            )
        );
    }, []);

    const deleteItem = useCallback((id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    }, []);

    const dailyVocab = useMemo(() => {
        const limit = 7;
        const sortedUnmastered = items
            .filter((item) => !item.mastered)
            .sort((a, b) => a.word.localeCompare(b.word));

        const revisionPool = items
            .filter((item) => needsReview(item))
            .sort((a, b) => a.word.localeCompare(b.word));

        const targetUnmastered = Math.max(1, Math.ceil(limit * 0.7));
        const selected = sortedUnmastered.slice(0, targetUnmastered);
        const remaining = limit - selected.length;

        const revisionCandidates = revisionPool.filter((item) => !selected.some((selectedItem) => selectedItem.id === item.id));
        selected.push(...revisionCandidates.slice(0, remaining));

        if (selected.length < limit) {
            const remainingItems = items.filter((item) => !selected.some((selectedItem) => selectedItem.id === item.id));
            selected.push(...remainingItems.slice(0, limit - selected.length));
        }

        return selected;
    }, [items]);

    const bookmarkCount = useMemo(
        () => items.filter((item) => item.bookmarked).length,
        [items]
    );

    const revisionDueCount = useMemo(
        () => items.filter((item) => needsReview(item)).length,
        [items]
    );

    const filtered = useMemo(
        () => ({
            items,
            dailyVocab,
            bookmarkCount,
            revisionDueCount,
        }),
        [items, dailyVocab, bookmarkCount, revisionDueCount]
    );

    return {
        ...filtered,
        addItem,
        addItems,
        updateItem,
        deleteItem,
        toggleBookmark,
        markAsLearned,
        markAsDifficult,
    };
}
