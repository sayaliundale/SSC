import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "../../../lib/mongodb";
import Task from "../../../models/Task";

export async function GET() {
    try {
        await connectDB();
        const tasks = await Task.find().sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch tasks",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const { title, time, priority, completed, date } = body;

        if (!title || !time || !date) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: title, time, date",
                },
                { status: 400 }
            );
        }

        const task = new Task({
            title,
            time,
            priority: priority || "low",
            completed: completed || false,
            date,
        });

        const savedTask = await task.save();
        return NextResponse.json(savedTask, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create task",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
