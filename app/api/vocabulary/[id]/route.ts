import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Vocabulary from "../../../../models/Vocabulary";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;
        const body = await request.json();

        const updatedItem = await Vocabulary.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return NextResponse.json(
                { success: false, message: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update item",
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

        const deletedItem = await Vocabulary.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json(
                { success: false, message: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Item deleted" });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete item",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
