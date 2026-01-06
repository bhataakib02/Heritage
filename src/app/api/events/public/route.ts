import { NextResponse } from "next/server";
import EventModel from "@/models/event-model";
import { connectDB } from "@/config/dbConfig";

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await connectDB();
        const events = await EventModel.find({}, {
            sort: { created_at: -1 }
        });
        
        // Return with no-cache headers to prevent Vercel caching
        return NextResponse.json({
            success: true,
            events: events || []
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error: any) {
        console.error("Error fetching public events:", error);
        return NextResponse.json({
            success: false,
            events: [],
            error: error.message
        }, { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    }
}

