"use client";

import { useCallback, useEffect, useState } from "react";
import type { TaskPriority } from "../models/Task";

type Task = {
    _id: string;
    title: string;
    time: string;
    priority: TaskPriority;
    completed: boolean;
    date: string;
    createdAt: string;
    updatedAt: string;
};

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/tasks");
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            const data = (await response.json()) as Task[];
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    const addTask = useCallback(async (taskData: Omit<Task, "_id" | "createdAt" | "updatedAt">) => {
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                throw new Error("Failed to add task");
            }
            const newTask = (await response.json()) as Task;
            setTasks((prev) => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add task");
            throw err;
        }
    }, []);

    const updateTask = useCallback(async (id: string, updates: Partial<Pick<Task, "title" | "time" | "priority" | "completed">>) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                throw new Error("Failed to update task");
            }
            const updatedTask = (await response.json()) as Task;
            setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)));
            return updatedTask;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update task");
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete task");
            }
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete task");
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
    };
}
