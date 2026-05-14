import mongoose, { Schema, Document } from "mongoose";

export type Subject = "Quant" | "English" | "Reasoning" | "GK";

export interface INote extends Document {
    title: string;
    content: string;
    subject: Subject;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
    {
        title: { type: String, required: true, default: "Untitled note" },
        content: { type: String, required: true, default: "<p>Start typing your note...</p>" },
        subject: { type: String, required: true, enum: ["Quant", "English", "Reasoning", "GK"], default: "Quant" },
    },
    { timestamps: true }
);

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
