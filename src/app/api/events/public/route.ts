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
        // Force fresh database connection - reconnect every time
        await connectDB();
        
        // Get fresh data from database - ALWAYS query fresh
        const events = await EventModel.find({}, {
            sort: { created_at: -1 }
        });
        
        // Log what we're actually returning
        console.log(`[API] Fetched ${events?.length || 0} events from database at ${new Date().toISOString()}`);
        
        // Add timestamp to response to ensure uniqueness
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        
        // ALWAYS return fresh data - never cache
        const responseData = {
            success: true,
            events: events || [], // Explicitly return empty array if null/undefined
            timestamp: timestamp,
            requestId: randomId,
            fetchedAt: new Date().toISOString()
        };
        
        // Return with aggressive no-cache headers to prevent ALL caching
        return NextResponse.json(responseData, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0, private',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Cache-Control': 'no-cache',
                'CDN-Cache-Control': 'no-cache',
                'Vercel-CDN-Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff',
                'X-Request-ID': randomId,
            }
        });
    } catch (error: any) {
        console.error("[API] Error fetching public events:", error);
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        
        return NextResponse.json({
            success: false,
            events: [], // Always return empty array on error
            error: error.message,
            timestamp: timestamp,
            requestId: randomId
        }, { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0, private',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Cache-Control': 'no-cache',
                'CDN-Cache-Control': 'no-cache',
                'Vercel-CDN-Cache-Control': 'no-cache',
                'X-Request-ID': randomId,
            }
        });
    }
}

