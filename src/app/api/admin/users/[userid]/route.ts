import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

// Disable caching for API routes
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function PUT(
    request: NextRequest,
    { params }: { params: { userid: string } }
) {
    try {
        const { userId } = auth();
        if (!userId)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Connect to database
        await connectDB().catch(error => {
            console.error("Database connection error:", error);
        });

        const reqBody = await request.json();
        
        // Don't allow updating clerkUserId or id
        delete reqBody.clerkUserId;
        delete reqBody.id;
        delete reqBody._id;
        
        // Ensure updated_at is set automatically
        reqBody.updated_at = new Date().toISOString();
        
        const updatedUser = await UserModel.findByIdAndUpdate(params.userid, reqBody);
        
        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Return response with no-cache headers
        return NextResponse.json(
            { message: "User updated successfully", user: updatedUser },
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
        console.error("Error updating user:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { userid: string } }
) {
    try {
        const { userId } = auth();
        if (!userId)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Connect to database
        await connectDB().catch(error => {
            console.error("Database connection error:", error);
        });

        // Check if user exists
        const user = await UserModel.findById(params.userid);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Prevent deleting yourself
        const currentUser = await UserModel.findOne({ clerkUserId: userId });
        if (currentUser && (currentUser.id === params.userid || (currentUser as any)._id === params.userid)) {
            return NextResponse.json(
                { message: "You cannot delete your own account" },
                { status: 400 }
            );
        }

        await UserModel.findByIdAndDelete(params.userid);
        
        // Return response with no-cache headers
        return NextResponse.json(
            { message: "User deleted successfully" },
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
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

