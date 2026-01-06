import PageTitle from "@/components/PageTitle";
import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/user-model";
import BookingModel from "@/models/booking-model";
import React from "react";
import UsersTableWithFeatures from "./_components/users-table-with-features";

// Disable caching to ensure fresh data on Vercel
export const revalidate = 0;
export const dynamic = 'force-dynamic';

async function UsersPage() {
    try {
        // Connect to database (non-blocking)
        await connectDB().catch(error => {
            console.error("Database connection error:", error);
        });

        // Fetch all users
        const users = await UserModel.find({}, {
            sort: { created_at: -1 }
        });

        // OPTIMIZED: Batch query all bookings instead of N+1 queries
        const userIds = users.map((u: any) => u.id || u._id).filter(Boolean);
        const allBookings = userIds.length > 0 
            ? await BookingModel.find({ user: userIds })
            : [];

        // Group bookings by user ID
        const bookingsByUser = new Map<string, any[]>();
        allBookings.forEach((booking: any) => {
            const userId = booking.user;
            if (!bookingsByUser.has(userId)) {
                bookingsByUser.set(userId, []);
            }
            bookingsByUser.get(userId)!.push(booking);
        });

        // Map users with their booking stats
        const usersWithBookings = users.map((user: any) => {
            const userId = user.id || user._id;
            const userBookings = bookingsByUser.get(userId) || [];
            return {
                ...user,
                bookingCount: userBookings.length,
                totalSpent: userBookings.reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0),
            };
        });

        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="All Users" showRefresh={true} />
                </div>
                <div className="mt-5">
                    <UsersTableWithFeatures users={JSON.parse(JSON.stringify(usersWithBookings))} />
                </div>
            </div>
        );
    } catch (error: any) {
        console.error("Error in UsersPage:", error);
        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="All Users" showRefresh={true} />
                </div>
                <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                    <p className="text-red-500 text-lg font-semibold mb-2">Error loading users</p>
                    <p className="text-gray-500 text-sm">{error.message}</p>
                </div>
            </div>
        );
    }
}

export default UsersPage;

