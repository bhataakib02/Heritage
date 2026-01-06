import { connectDB } from "@/config/dbConfig";
import EventModel from "@/models/event-model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getUserIdOfLoggedInUser, handleNewUserRegistration } from "@/actions/users";

// Disable caching for API routes
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { userId: clerkUserId } = auth();
        if (!clerkUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Connect to database
        await connectDB().catch(error => {
            console.error("Database connection error:", error);
        });

        // Ensure user exists in database (register if needed)
        let userId = await getUserIdOfLoggedInUser();
        if (!userId) {
            // User not in database, register them first
            try {
                const newUser = await handleNewUserRegistration();
                if (newUser) {
                    userId = (newUser as any).id || (newUser as any)._id;
                }
            } catch (regError: any) {
                console.error("Error registering user:", regError);
                return NextResponse.json(
                    { message: "Failed to register user. Please try again." },
                    { status: 500 }
                );
            }
        }

        if (!userId) {
            return NextResponse.json(
                { message: "User not found. Please try logging in again." },
                { status: 400 }
            );
        }

        const reqBody = await request.json();
        
        // Validate required fields
        if (!reqBody.name || !reqBody.description || !reqBody.organizer) {
            return NextResponse.json(
                { message: "Name, description, and organizer are required fields" },
                { status: 400 }
            );
        }

        // Set user ID and timestamps
        reqBody.user = userId;
        reqBody.created_at = new Date().toISOString();
        reqBody.updated_at = new Date().toISOString();

        // Ensure arrays are initialized
        if (!reqBody.images) reqBody.images = [];
        if (!reqBody.ticketTypes) reqBody.ticketTypes = [];
        if (!reqBody.guests) reqBody.guests = [];

        const createdEvent = await EventModel.create(reqBody);
        
        return NextResponse.json(
            { 
                message: "Museum created successfully",
                event: createdEvent
            },
            { 
                status: 201,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            }
        );
    } catch (error: any) {
        console.error("Error creating event:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            details: error.details
        });
        
        return NextResponse.json(
            { 
                message: error.message || "Failed to create museum. Please try again.",
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}