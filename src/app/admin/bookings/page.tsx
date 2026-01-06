import { getMongoDBUserIDOfLoggedInUser } from "@/actions/users";
import PageTitle from "@/components/PageTitle";
import { connectDB } from "@/config/dbConfig";
import { BookingType, EventType } from "@/interfaces/events";
import BookingModel from "@/models/booking-model";
import EventModel from "@/models/event-model";
import UserModel from "@/models/user-model";
import dayjs from "dayjs";
import Link from "next/link";

import React from "react";
import BookingsListWithFeatures from "./_components/bookings-list-with-features";
connectDB();
async function BookingsPage() {
    try {
        // Fetch all bookings
        const bookings = await BookingModel.find({});
        
        if (bookings.length === 0) {
            return (
                <div>
                    <div className="mb-5">
                        <PageTitle title="All Bookings" showRefresh={true} />
                    </div>
                    <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                        <p className="text-gray-500 text-lg">No bookings found.</p>
                    </div>
                </div>
            );
        }
        
        // Get unique event IDs and user IDs
        const eventIds = [...new Set(bookings.map((b: any) => b.event).filter(Boolean))];
        const userIds = [...new Set(bookings.map((b: any) => b.user).filter(Boolean))];
        
        // OPTIMIZED: Batch fetch events and users instead of sequential loops
        const events: any[] = [];
        const users: any[] = [];
        
        if (eventIds.length > 0) {
            // Use batch query with array filter
            const eventsResult = await EventModel.find({ id: eventIds });
            if (Array.isArray(eventsResult)) {
                events.push(...eventsResult);
            }
        }
        
        if (userIds.length > 0) {
            // Use batch query with array filter
            const usersResult = await UserModel.find({ id: userIds });
            if (Array.isArray(usersResult)) {
                users.push(...usersResult);
            }
        }
        
        // Create maps for quick lookup - handle both id and _id
        const eventMap = new Map();
        events.forEach((e: any) => {
            if (e.id) eventMap.set(e.id, e);
            if (e._id) eventMap.set(e._id, e);
        });
        
        const userMap = new Map();
        users.forEach((u: any) => {
            if (u.id) userMap.set(u.id, u);
            if (u._id) userMap.set(u._id, u);
        });
        
        // Map bookings with populated event and user
        const bookedEvents: BookingType[] = bookings.map((booking: any) => {
            const eventId = booking.event;
            const userId = booking.user;
            
            return {
                ...booking,
                event: eventMap.get(eventId) || { id: eventId, name: "Event not found", location: "N/A", date: "N/A", time: "N/A" },
                user: userMap.get(userId) || { id: userId, userName: "User not found" },
                _id: booking.id || booking._id,
                createdAt: booking.created_at || booking.createdAt
            };
        }) as any;

        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="All Bookings" showRefresh={true} />
                </div>
                <BookingsListWithFeatures bookings={JSON.parse(JSON.stringify(bookedEvents))} />
            </div>
        );
    } catch (error: any) {
        console.error("Error in BookingsPage:", error);
        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="All Bookings" showRefresh={true} />
                </div>
                <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                    <p className="text-red-500 text-lg font-semibold mb-2">Error loading bookings</p>
                    <p className="text-gray-500 text-sm">{error.message}</p>
                </div>
            </div>
        );
    }
}

export default BookingsPage;