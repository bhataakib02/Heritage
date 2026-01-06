import PageTitle from "@/components/PageTitle";
import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/user-model";
import BookingModel from "@/models/booking-model";
import EventModel from "@/models/event-model";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";

connectDB();

interface Props {
    params: {
        userid: string;
    };
}

async function UserDetailPage({ params }: Props) {
    try {
        // Fetch user
        const user = await UserModel.findById(params.userid);
        
        if (!user) {
            return (
                <div>
                    <div className="mb-5">
                        <PageTitle title="User Details" showRefresh={true} />
                    </div>
                    <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                        <p className="text-red-500 text-lg font-semibold mb-2">User not found</p>
                        <p className="text-gray-500 text-sm">The user with ID <code className="bg-gray-100 px-2 py-1 rounded text-xs">{params.userid}</code> does not exist in the database.</p>
                    </div>
                </div>
            );
        }

        // Fetch all bookings for this user
        const bookings = await BookingModel.find({ user: params.userid });
        
        // Fetch events for bookings
        const eventIds = Array.from(new Set(bookings.map((b: any) => b.event).filter(Boolean)));
        const events = [];
        for (const eventId of eventIds) {
            const event = await EventModel.findById(eventId);
            if (event) events.push(event);
        }
        
        const eventMap = new Map(events.map((e: any) => [(e.id || e._id), e]));
        
        // Map bookings with event details
        const bookingsWithEvents = bookings.map((booking: any) => ({
            ...booking,
            event: eventMap.get(booking.event) || { name: "Event not found" },
            _id: booking.id || booking._id,
            createdAt: booking.created_at || booking.createdAt
        }));

        // Calculate statistics
        const totalBookings = bookings.length;
        const totalSpent = bookings.reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0);
        const totalTickets = bookings.reduce((sum: number, b: any) => sum + (Number(b.ticketsCount) || 0), 0);
        const activeBookings = bookings.filter((b: any) => b.status === 'booked').length;
        const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length;

        const getProperty = ({ key, value }: { key: string; value: any }) => {
            return (
                <div>
                    <h1 className="font-semibold">{key}</h1>
                    <h1 className="text-gray-700 text-sm">{value || "N/A"}</h1>
                </div>
            );
        };

        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="User Details" showRefresh={true} />
                </div>

                {/* User Information Card */}
                <div className="bg-white rounded-sm border border-gray-200 p-5 mb-5">
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {getProperty({ key: "User Name", value: (user as any).userName })}
                        {getProperty({ key: "Email", value: (user as any).email })}
                        {getProperty({ 
                            key: "Role", 
                            value: (user as any).isAdmin ? (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Admin</span>
                            ) : (
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">User</span>
                            )
                        })}
                        {getProperty({ 
                            key: "Status", 
                            value: (user as any).isActive ? "Active" : "Inactive" 
                        })}
                        {getProperty({ 
                            key: "Joined Date", 
                            value: dayjs((user as any).created_at || (user as any).createdAt).format("DD/MM/YYYY hh:mm A") 
                        })}
                        {getProperty({ 
                            key: "Clerk User ID", 
                            value: (user as any).clerkUserId 
                        })}
                    </div>
                </div>

                {/* Statistics Card */}
                <div className="bg-white rounded-sm border border-gray-200 p-5 mb-5">
                    <h2 className="text-xl font-semibold mb-4">Booking Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                        {getProperty({ key: "Total Bookings", value: totalBookings })}
                        {getProperty({ key: "Active Bookings", value: activeBookings })}
                        {getProperty({ key: "Cancelled", value: cancelledBookings })}
                        {getProperty({ key: "Total Tickets", value: totalTickets })}
                        {getProperty({ key: "Total Spent", value: `₹${totalSpent}` })}
                    </div>
                </div>

                {/* Bookings History */}
                <div className="bg-white rounded-sm border border-gray-200 p-5">
                    <h2 className="text-xl font-semibold mb-4">Booking History</h2>
                    {bookingsWithEvents.length === 0 ? (
                        <p className="text-gray-500 text-center py-5">No bookings found for this user.</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {bookingsWithEvents.map((booking: any) => (
                                <div
                                    key={booking._id}
                                    className="border border-gray-300 bg-gray-100 rounded-sm p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {(booking.event as any)?.name || "Event not found"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {(booking.event as any)?.location || "N/A"} • {(booking.event as any)?.date || "N/A"}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                                            booking.status === 'booked' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {booking.status || 'booked'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        {getProperty({ key: "Booking ID", value: booking._id?.toString().slice(0, 8) + "..." })}
                                        {getProperty({ key: "Ticket Type", value: booking.ticketType })}
                                        {getProperty({ key: "Tickets", value: booking.ticketsCount })}
                                        {getProperty({ key: "Amount", value: `₹${booking.totalAmount}` })}
                                        {getProperty({ key: "Payment ID", value: booking.paymentId })}
                                        {getProperty({ 
                                            key: "Booked On", 
                                            value: booking.createdAt 
                                                ? dayjs(booking.createdAt).format("DD/MM/YYYY hh:mm A") 
                                                : "N/A"
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error: any) {
        console.error("Error in UserDetailPage:", error);
        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="User Details" showRefresh={true} />
                </div>
                <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                    <p className="text-red-500 text-lg font-semibold mb-2">Error loading user details</p>
                    <p className="text-gray-500 text-sm">{error.message || "An unexpected error occurred."}</p>
                </div>
            </div>
        );
    }
}

export default UserDetailPage;

