import { NextResponse } from "next/server";
import EventModel from "@/models/event-model";
import { connectDB } from "@/config/dbConfig";

// Force dynamic rendering - disable ALL caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        // Force fresh database connection
        await connectDB();
        
        // Get fresh data from database
        const events = await EventModel.find({}, {
            sort: { created_at: -1 }
        });
        
        // Add timestamp to response to ensure uniqueness
        const timestamp = Date.now();
        
        // Return with aggressive no-cache headers to prevent ALL caching
        return NextResponse.json({
            success: true,
            events: events || [],
            timestamp: timestamp // Add timestamp to response
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Cache-Control': 'no-cache',
                'CDN-Cache-Control': 'no-cache',
                'Vercel-CDN-Cache-Control': 'no-cache',
            }
        });
    } catch (error: any) {
        console.error("Error fetching public events:", error);
        return NextResponse.json({
            success: false,
            events: [],
            error: error.message,
            timestamp: Date.now()
        }, { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Cache-Control': 'no-cache',
                'CDN-Cache-Control': 'no-cache',
                'Vercel-CDN-Cache-Control': 'no-cache',
            }
        });
    }
}

