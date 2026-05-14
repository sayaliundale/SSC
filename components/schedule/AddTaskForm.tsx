'use client';

import { useState } from 'react';
import type { TaskPriority } from '../../models/Task';

type AddTaskFormProps = {
    onAddTask: (task: { title: string; time: string; priority: TaskPriority; date: string }) => Promise<void>;
};

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('08:00');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title.trim() || loading) return;

        setLoading(true);
        try {
            await onAddTask({
                title: title.trim(),
                time: time || '08:00',
                priority,
                date: new Date().toISOString().split('T')[0], // Today's date
            });
            setTitle('');
            setTime('08:00');
            setPriority('medium');
        } catch (error) {
            console.error('Failed to add task:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Add New Task</h2>
                <p className="mt-2 text-sm text-slate-500">Create a new schedule item for today.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                    Task name
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Enter task title"
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                    Time
                    <input
                        type="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </label>
            </div>

            <label className="space-y-2 text-sm text-slate-700">
                Priority
                <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as TaskPriority)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </label>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
}
