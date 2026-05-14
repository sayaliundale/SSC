import mongoose, { Document, Model } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskDocument extends Document {
    title: string;
    time: string;
    priority: TaskPriority;
    completed: boolean;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new mongoose.Schema<TaskDocument>(
    {
        title: { type: String, required: true },
        time: { type: String, required: true },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
            required: true,
        },
        completed: { type: Boolean, default: false, required: true },
        date: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Task = (mongoose.models.Task as Model<TaskDocument>) || mongoose.model<TaskDocument>("Task", TaskSchema);

export default Task;
