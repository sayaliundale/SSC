'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type VocabType = 'synonym' | 'antonym' | 'idiom' | 'one-word';
export type VocabSource = 'PYQ' | 'manual' | 'imported';
export type VocabDifficulty = 'easy' | 'medium' | 'hard';

export type VocabularyItem = {
    _id: string;
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

const todayString = () => new Date().toISOString().slice(0, 10);

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

export function useVocabulary() {
    const [items, setItems] = useState<VocabularyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVocab = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/vocabulary');
            if (!response.ok) throw new Error('Failed to fetch vocabulary');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVocab();
    }, [fetchVocab]);

    const addItem = useCallback(
        async (item: Omit<VocabularyItem, '_id' | 'mastered' | 'bookmarked' | 'revisionCount' | 'lastReviewed'>) => {
            try {
                const response = await fetch('/api/vocabulary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...item,
                        mastered: false,
                        bookmarked: false,
                        revisionCount: 0,
                    }),
                });
                if (!response.ok) throw new Error('Failed to add item');
                const newItem = await response.json();
                setItems((current) => [...current, newItem]);
                return newItem;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to add item');
            }
        },
        []
    );

    const updateItem = useCallback(async (id: string, updates: Partial<Omit<VocabularyItem, '_id'>>) => {
        const previousItems = [...items];
        setItems((current) =>
            current.map((item) => (item._id === id ? { ...item, ...updates } : item))
        );

        try {
            const response = await fetch(`/api/vocabulary/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update item');
            const updatedItem = await response.json();
            setItems((current) =>
                current.map((item) => (item._id === id ? updatedItem : item))
            );
        } catch (err) {
            setItems(previousItems);
            setError(err instanceof Error ? err.message : 'Failed to update item');
        }
    }, [items]);

    const toggleBookmark = useCallback((id: string) => {
        const item = items.find((i) => i._id === id);
        if (item) {
            updateItem(id, { bookmarked: !item.bookmarked });
        }
    }, [items, updateItem]);

    const markAsLearned = useCallback((id: string) => {
        const item = items.find((i) => i._id === id);
        if (item) {
            updateItem(id, {
                mastered: true,
                revisionCount: (item.revisionCount || 0) + 1,
                lastReviewed: todayString(),
            });
        }
    }, [items, updateItem]);

    const markAsDifficult = useCallback((id: string) => {
        const item = items.find((i) => i._id === id);
        if (item) {
            updateItem(id, {
                mastered: false,
                revisionCount: (item.revisionCount || 0) + 1,
                lastReviewed: todayString(),
                difficulty: 'hard',
            });
        }
    }, [items, updateItem]);

    const deleteItem = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/vocabulary/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete item');
            setItems((current) => current.filter((item) => item._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete item');
        }
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

        const revisionCandidates = revisionPool.filter((item) => !selected.some((selectedItem) => selectedItem._id === item._id));
        selected.push(...revisionCandidates.slice(0, remaining));

        if (selected.length < limit) {
            const remainingItems = items.filter((item) => !selected.some((selectedItem) => selectedItem._id === item._id));
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

    return {
        items,
        dailyVocab,
        bookmarkCount,
        revisionDueCount,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        toggleBookmark,
        markAsLearned,
        markAsDifficult,
    };
}

