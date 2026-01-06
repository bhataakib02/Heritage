import { NextResponse } from "next/server";
import EventModel from "@/models/event-model";
import { connectDB } from "@/config/dbConfig";

// Force dynamic rendering - disable ALL caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Route segment config - ensure no edge caching
export const preferredRegion = 'iad1'; // Use specific region, not edge

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
        console.log(`[API] Event IDs:`, events.map(e => e._id || e.id));
        
        // Add timestamp to response to ensure uniqueness
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const requestTime = new Date().toISOString();
        
        // ALWAYS return fresh data - never cache
        const responseData = {
            success: true,
            events: events || [], // Explicitly return empty array if null/undefined
            timestamp: timestamp,
            requestId: randomId,
            fetchedAt: requestTime,
            eventCount: events?.length || 0,
            _cacheBuster: `v${timestamp}-${randomId}` // Additional cache buster
        };
        
        // Return with aggressive no-cache headers to prevent ALL caching
        const response = NextResponse.json(responseData, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0, private, no-transform',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Cache-Control': 'no-cache',
                'CDN-Cache-Control': 'no-cache',
                'Vercel-CDN-Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff',
                'X-Request-ID': randomId,
                'X-Response-Time': timestamp.toString(),
                'X-Fetched-At': requestTime,
                'Vary': '*', // Tell CDN to vary on everything
            }
        });
        
        // Additional header manipulation to ensure no caching
        response.headers.delete('ETag');
        response.headers.delete('Last-Modified');
        
        return response;
    } catch (error: any) {
        console.error("[API] Error fetching public events:", error);
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        
        const errorResponse = NextResponse.json({
            success: false,
            events: [], // Always return empty array on error
            error: error.message,
            timestamp: timestamp,
            requestId: randomId
        }, { 
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0, private, no-transform',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Cache-Control': 'no-cache',
                'CDN-Cache-Control': 'no-cache',
                'Vercel-CDN-Cache-Control': 'no-cache',
                'X-Request-ID': randomId,
                'Vary': '*',
            }
        });
        
        // Remove caching headers
        errorResponse.headers.delete('ETag');
        errorResponse.headers.delete('Last-Modified');
        
        return errorResponse;
    }
}

