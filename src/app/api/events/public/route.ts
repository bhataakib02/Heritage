import { NextResponse } from "next/server";
import EventModel from "@/models/event-model";
import { connectDB } from "@/config/dbConfig";

export async function GET() {
    try {
        await connectDB();
        const events = await EventModel.find({}, {
            sort: { created_at: -1 }
        });
        
        return NextResponse.json({
            success: true,
            events: events || []
        });
    } catch (error: any) {
        console.error("Error fetching public events:", error);
        return NextResponse.json({
            success: false,
            events: [],
            error: error.message
        }, { status: 500 });
    }
}

