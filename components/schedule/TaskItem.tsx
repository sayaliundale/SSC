'use client';

import { useMemo, useState } from 'react';
import type { Task, TaskPriority } from './useTasks';

const priorityStyles: Record<TaskPriority, string> = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
};

const formatTime = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${normalizedHour}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

type TaskItemProps = {
    task: Task;
    onToggle: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Omit<Task, 'id' | 'date'>>) => void;
    onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [time, setTime] = useState(task.time);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);

    const labelClasses = useMemo(
        () => `rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[priority]}`,
        [priority]
    );

    const handleSave = () => {
        if (!title.trim()) return;
        onUpdate(task.id, { title: title.trim(), time: time || '08:00', priority });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(task.title);
        setTime(task.time);
        setPriority(task.priority);
        setIsEditing(false);
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                        aria-label="Toggle task completion"
                    />
                    <div className="min-w-0 flex-1">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="Task name"
                                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="space-y-2 text-sm text-slate-700">
                                        Time
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(event) => setTime(event.target.value)}
                                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm text-slate-700">
                                        Priority
                                        <select
                                            value={priority}
                                            onChange={(event) => setPriority(event.target.value as TaskPriority)}
                                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className={`text-sm font-semibold text-slate-900 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                    {task.title}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                    <span>{formatTime(task.time)}</span>
                                    <span className={labelClasses}>{task.priority}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(task.id)}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
