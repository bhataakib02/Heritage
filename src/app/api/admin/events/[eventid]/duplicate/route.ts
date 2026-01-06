import { connectDB } from "@/config/dbConfig";
import EventModel from "@/models/event-model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getUserIdOfLoggedInUser } from "@/actions/users";

connectDB();

export async function POST(
    request: NextRequest,
    { params }: { params: { eventid: string } }
) {
    try {
        const { userId } = auth();
        if (!userId)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const originalEvent = await EventModel.findById(params.eventid);
        if (!originalEvent) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const userId = await getUserIdOfLoggedInUser();
        
        // Create duplicate without id and timestamps
        const eventData: any = {
            ...originalEvent,
            name: `${(originalEvent as any).name} (Copy)`,
            user: userId,
        };
        
        // Remove id and timestamps so new ones are generated
        delete eventData.id;
        delete eventData._id;
        delete eventData.created_at;
        delete eventData.createdAt;
        delete eventData.updated_at;
        delete eventData.updatedAt;

        const newEvent = await EventModel.create(eventData);
        
        return NextResponse.json(
            { 
                message: "Event duplicated successfully",
                id: (newEvent as any).id || (newEvent as any)._id
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

