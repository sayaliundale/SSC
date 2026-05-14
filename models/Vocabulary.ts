import mongoose, { Schema, Document } from "mongoose";

export type VocabType = "synonym" | "antonym" | "idiom" | "one-word";
export type VocabSource = "PYQ" | "manual" | "imported";
export type VocabDifficulty = "easy" | "medium" | "hard";

export interface IVocabulary extends Document {
    word: string;
    type: VocabType;
    meaning?: string;
    synonym?: string;
    antonym?: string;
    example?: string;
    source?: VocabSource;
    year?: number;
    difficulty?: VocabDifficulty;
    mastered: boolean;
    bookmarked: boolean;
    revisionCount: number;
    lastReviewed?: Date;
}

const VocabularySchema: Schema = new Schema(
    {
        word: { type: String, required: true },
        type: { type: String, required: true, enum: ["synonym", "antonym", "idiom", "one-word"] },
        meaning: { type: String },
        synonym: { type: String },
        antonym: { type: String },
        example: { type: String },
        source: { type: String, enum: ["PYQ", "manual", "imported"], default: "manual" },
        year: { type: Number },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
        mastered: { type: Boolean, default: false },
        bookmarked: { type: Boolean, default: false },
        revisionCount: { type: Number, default: 0 },
        lastReviewed: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.Vocabulary || mongoose.model<IVocabulary>("Vocabulary", VocabularySchema);
