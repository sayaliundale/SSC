import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Task from "../../../models/Task";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await request.json();

        const { title, time, priority, completed } = body;

        const updatedTask = await Task.findByIdAndUpdate(
            params.id,
            { title, time, priority, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update task",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const deletedTask = await Task.findByIdAndDelete(params.id);

        if (!deletedTask) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Task deleted" });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete task",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
