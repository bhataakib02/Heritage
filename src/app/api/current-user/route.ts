import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/user-model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
connectDB()

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ user: null, message: "Unauthorized" }, { status: 401 });
        }

        const userInDb = await UserModel.findOne({ clerkUserId: userId });
        
        // Return user or null (don't throw error if user doesn't exist yet)
        return NextResponse.json({ user: userInDb || null }, { status: 200 });
    } catch (error: any) {
        console.error("Error in current-user route:", error);
        return NextResponse.json({ user: null, message: error.message }, { status: 500 });
    }
}