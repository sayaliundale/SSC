'use client';

import AddTaskForm from '../../components/schedule/AddTaskForm';
import TaskList from '../../components/schedule/TaskList';
import { useTasks } from '../../hooks/useTasks';

export default function SchedulePage() {
    const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();

    const handleToggle = async (id: string) => {
        const task = tasks.find(t => t._id.toString() === id);
        if (task) {
            await updateTask(id, { completed: !task.completed });
        }
    };

    if (error) {
        return (
            <section className="space-y-6">
                <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
                    <p className="text-red-700">Failed to load tasks: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-500">Today</p>
                        <h1 className="text-3xl font-semibold text-slate-900">Daily Planner</h1>
                        <p className="mt-3 max-w-2xl text-slate-600">
                            Manage tasks for today and keep your schedule synced with the dashboard widget.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        {loading ? 'Loading...' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} today`}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
                <AddTaskForm onAddTask={addTask} />

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-slate-900">Today’s Tasks</h2>
                            <p className="mt-2 text-sm text-slate-500">Tasks are grouped by scheduled time and stored in MongoDB.</p>
                        </div>
                        {loading ? (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                                Loading tasks...
                            </div>
                        ) : (
                            <TaskList tasks={tasks} onToggle={handleToggle} onUpdate={updateTask} onDelete={deleteTask} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}