'use client';

import type { TaskDocument } from '../../models/Task';
import TaskItem from './TaskItem';

const parseTime = (value: string) => {
    const [hourStr, minuteStr] = value.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    return Number.isNaN(hour) || Number.isNaN(minute) ? 0 : hour * 60 + minute;
};

const formatTimeLabel = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${normalizedHour}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

type TaskListProps = {
    tasks: TaskDocument[];
    onToggle: (id: string) => Promise<void>;
    onUpdate: (id: string, updates: Partial<Pick<TaskDocument, 'title' | 'time' | 'priority'>>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
};

export default function TaskList({ tasks, onToggle, onUpdate, onDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No tasks yet. Add a task to start your daily planner.
            </div>
        );
    }

    const grouped = tasks.reduce<Record<string, TaskDocument[]>>((acc, task) => {
        if (!acc[task.time]) acc[task.time] = [];
        acc[task.time].push(task);
        return acc;
    }, {});

    const sortedTimes = Object.keys(grouped).sort((a, b) => parseTime(a) - parseTime(b));

    return (
        <div className="space-y-6">
            {sortedTimes.map((time) => (
                <div key={time} className="space-y-4">
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        {formatTimeLabel(time)}
                    </div>
                    <div className="space-y-4">
                        {grouped[time].map((task) => (
                            <TaskItem key={task._id.toString()} task={task} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
