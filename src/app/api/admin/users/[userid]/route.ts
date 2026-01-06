import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

connectDB();

export async function PUT(
    request: NextRequest,
    { params }: { params: { userid: string } }
) {
    try {
        const { userId } = auth();
        if (!userId)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const reqBody = await request.json();
        
        // Don't allow updating clerkUserId or id
        delete reqBody.clerkUserId;
        delete reqBody.id;
        delete reqBody._id;
        
        await UserModel.findByIdAndUpdate(params.userid, reqBody);
        return NextResponse.json(
            { message: "User updated successfully" },
            { status: 200 }
        );
    } catch (error: any) {
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

        // Check if user exists
        const user = await UserModel.findById(params.userid);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Prevent deleting yourself
        const currentUser = await UserModel.findOne({ clerkUserId: userId });
        if (currentUser && (currentUser.id === params.userid || currentUser._id === params.userid)) {
            return NextResponse.json(
                { message: "You cannot delete your own account" },
                { status: 400 }
            );
        }

        await UserModel.findByIdAndDelete(params.userid);
        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

