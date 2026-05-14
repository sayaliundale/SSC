'use client';

import Link from 'next/link';
import WidgetCard from './WidgetCard';
import { useTasks } from '../schedule/useTasks';

const formatTime = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${normalizedHour}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

const priorityPill = (priority: string) => {
    if (priority === 'high') return 'bg-rose-100 text-rose-700';
    if (priority === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
};

export default function ScheduleWidget() {
    const { tasks } = useTasks();
    const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <WidgetCard title="Today’s Schedule" subtitle="Quick access to today’s task list" className="lg:row-span-2">
            <div className="space-y-4">
                {sortedTasks.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                        No schedule items yet. Create tasks in the schedule page.
                    </div>
                ) : (
                    sortedTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    readOnly
                                    className="h-5 w-5 rounded border-slate-300 bg-white text-slate-900"
                                />
                                <div>
                                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                        {task.title}
                                    </p>
                                    <p className="text-sm text-slate-600">{formatTime(task.time)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityPill(task.priority)}`}>{task.priority}</span>
                                <button className="text-slate-400 transition hover:text-slate-600" aria-label="Edit task">✏️</button>
                                <button className="text-slate-400 transition hover:text-slate-600" aria-label="Delete task">🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-3xl bg-slate-100 p-4">
                <p className="text-sm text-slate-600">{tasks.length} task{tasks.length === 1 ? '' : 's'} planned today</p>
                <Link href="/schedule" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Manage Tasks
                </Link>
            </div>
        </WidgetCard>
    );
}
