'use client';

import AddTaskForm from '../../components/schedule/AddTaskForm';
import TaskList from '../../components/schedule/TaskList';
import { useTasks } from '../../components/schedule/useTasks';

export default function SchedulePage() {
    const { tasks, addTask, toggleTask, updateTask, deleteTask, dateKey } = useTasks();

    return (
        <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Today</p>
                        <h1 className="text-3xl font-semibold text-slate-900">Daily Planner</h1>
                        <p className="mt-3 max-w-2xl text-slate-600">
                            Manage tasks for {dateKey} and keep your schedule synced with the dashboard widget.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        {tasks.length} task{tasks.length === 1 ? '' : 's'} today
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
                <AddTaskForm onAddTask={addTask} />

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-slate-900">Today’s Tasks</h2>
                            <p className="mt-2 text-sm text-slate-500">Tasks are grouped by scheduled time and stored locally.</p>
                        </div>
                        <TaskList tasks={tasks} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />
                    </div>
                </div>
            </div>
        </section>
    );
}