import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Note from "../../../../models/Note";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;
        const body = await request.json();

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return NextResponse.json(
                { success: false, message: "Note not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedNote);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update note",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return NextResponse.json(
                { success: false, message: "Note not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Note deleted" });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete note",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
