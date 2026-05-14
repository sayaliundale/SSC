import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "../../../../lib/mongodb";
import SubjectWorkspace from "../../../../models/SubjectWorkspace";

export async function GET(
    _request: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        await connectDB();
        const { key } = params;
        let workspace = await SubjectWorkspace.findOne({ subjectKey: key });
        
        if (!workspace) {
            // Return default structure if not found
            return NextResponse.json({
                subjectKey: key,
                materials: [],
                links: [],
                revision: [],
                weakTopics: [],
                lastStudied: new Date().toISOString()
            });
        }
        
        return NextResponse.json(workspace);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch subject workspace",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        await connectDB();
        const { key } = params;
        const body = await request.json();

        const workspace = await SubjectWorkspace.findOneAndUpdate(
            { subjectKey: key },
            { ...body, subjectKey: key },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json(workspace);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update subject workspace",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
