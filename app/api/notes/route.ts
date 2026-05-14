import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "../../../lib/mongodb";
import Note from "../../../models/Note";

export async function GET() {
    try {
        await connectDB();
        const notes = await Note.find().sort({ updatedAt: -1 });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch notes",
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

        const { title, content, subject } = body;

        const note = new Note({
            title: title || "Untitled note",
            content: content || "<p>Start typing your note...</p>",
            subject: subject || "Quant",
        });

        const savedNote = await note.save();
        return NextResponse.json(savedNote, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create note",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
