import mongoose, { Schema, Document } from "mongoose";

export interface ISubjectMaterial {
    id: string;
    name: string;
    type: "pdf" | "image";
    uploadedAt: Date;
}

export interface ISubjectLink {
    id: string;
    title: string;
    url: string;
    createdAt: Date;
}

export interface IRevisionItem {
    id: string;
    title: string;
    note: string;
    category: "Bookmark" | "Weak topic";
    createdAt: Date;
}

export interface ISubjectWorkspace extends Document {
    subjectKey: string;
    materials: ISubjectMaterial[];
    links: ISubjectLink[];
    revision: IRevisionItem[];
    lastStudied: Date;
    weakTopics: string[];
}

const SubjectWorkspaceSchema: Schema = new Schema(
    {
        subjectKey: { type: String, required: true, unique: true },
        materials: [
            {
                id: { type: String, required: true },
                name: { type: String, required: true },
                type: { type: String, enum: ["pdf", "image"], required: true },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        links: [
            {
                id: { type: String, required: true },
                title: { type: String, required: true },
                url: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        revision: [
            {
                id: { type: String, required: true },
                title: { type: String, required: true },
                note: { type: String, required: true },
                category: { type: String, enum: ["Bookmark", "Weak topic"], required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        lastStudied: { type: Date, default: Date.now },
        weakTopics: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.models.SubjectWorkspace || mongoose.model<ISubjectWorkspace>("SubjectWorkspace", SubjectWorkspaceSchema);
