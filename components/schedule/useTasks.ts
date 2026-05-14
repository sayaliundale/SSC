'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
    id: string;
    title: string;
    time: string;
    priority: TaskPriority;
    completed: boolean;
    date: string;
};

const formatDateKey = (value?: string) => {
    if (!value) return new Date().toISOString().slice(0, 10);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
    return date.toISOString().slice(0, 10);
};

const storageKeyForDate = (dateString?: string) => `ssc_tasks_${formatDateKey(dateString)}`;

const loadTasks = (key: string): Task[] => {
    if (typeof window === 'undefined') return [];
    try {
        const value = window.localStorage.getItem(key);
        return value ? (JSON.parse(value) as Task[]) : [];
    } catch {
        return [];
    }
};

const saveTasks = (key: string, tasks: Task[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(tasks));
};

export function useTasks(date?: string) {
    const today = useMemo(() => formatDateKey(date), [date]);
    const storageKey = useMemo(() => storageKeyForDate(today), [today]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        setTasks(loadTasks(storageKey));
    }, [storageKey]);

    useEffect(() => {
        saveTasks(storageKey, tasks);
    }, [storageKey, tasks]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.storageArea === window.localStorage && event.key === storageKey) {
                setTasks(loadTasks(storageKey));
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [storageKey]);

    const addTask = useCallback(
        (task: { title: string; time: string; priority: TaskPriority }) => {
            setTasks((currentTasks) => [
                ...currentTasks,
                {
                    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    title: task.title.trim(),
                    time: task.time || '08:00',
                    priority: task.priority,
                    completed: false,
                    date: today,
                },
            ]);
        },
        [today]
    );

    const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'date'>>) => {
        setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    }, []);

    const toggleTask = useCallback((id: string) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
        );
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    }, []);

    return {
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        dateKey: today,
    };
}
