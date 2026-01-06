import { connectDB } from "@/config/dbConfig";
import EventModel from "@/models/event-model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

// Disable caching for API routes
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function PUT(
    request: NextRequest,
    { params }: { params: { eventid: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Connect to database
        await connectDB().catch(error => {
            console.error("Database connection error:", error);
        });

        const reqBody = await request.json();
        
        // Ensure updated_at is set automatically
        reqBody.updated_at = new Date().toISOString();
        
        const updatedEvent = await EventModel.findByIdAndUpdate(params.eventid, reqBody);
        
        if (!updatedEvent) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                message: "Event updated successfully",
                event: updatedEvent
            },
            { 
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            }
        );
    } catch (error: any) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { 
                message: error.message || "Failed to update event. Please try again.",
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { eventid: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Connect to database
        await connectDB().catch(error => {
            console.error("Database connection error:", error);
        });

        // Check if event exists
        const event = await EventModel.findById(params.eventid);
        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        await EventModel.findByIdAndDelete(params.eventid);
        
        return NextResponse.json(
            { message: "Museum deleted successfully" },
            { 
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            }
        );
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return NextResponse.json(
            { 
                message: error.message || "Failed to delete event. Please try again.",
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}