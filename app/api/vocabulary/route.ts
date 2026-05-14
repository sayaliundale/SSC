import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "../../../lib/mongodb";
import Vocabulary from "../../../models/Vocabulary";

export async function GET() {
    try {
        await connectDB();
        const items = await Vocabulary.find().sort({ word: 1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch vocabulary",
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

        const item = new Vocabulary({
            ...body,
        });

        const savedItem = await item.save();
        return NextResponse.json(savedItem, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create vocabulary item",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
