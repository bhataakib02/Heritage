import { EventType } from "@/interfaces/events";
import EventModel from "@/models/event-model";
import React from "react";
import BookingModel from "@/models/booking-model";
import { connectDB } from "@/config/dbConfig";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";

connectDB();

interface Props {
    params: {
        eventid: string;
    };
}

async function EventReportPage({ params }: Props) {
    const eventData = await EventModel.findById(params.eventid);
    const event: EventType = {
        ...eventData,
        _id: (eventData as any)?.id || (eventData as any)?._id,
        createdAt: (eventData as any)?.created_at || (eventData as any)?.createdAt,
    } as any;
    
    const eventBookings = await BookingModel.find({
        event: params.eventid,
        status: "booked",
    });

    // Fetch users for bookings
    const userIds = [...new Set(eventBookings.map((b: any) => b.user).filter(Boolean))];
    const UserModel = (await import("@/models/user-model")).default;
    const users = [];
    for (const userId of userIds) {
        const user = await UserModel.findById(userId);
        if (user) users.push(user);
    }
    const userMap = new Map(users.map((u: any) => [(u.id || u._id), u]));

    let ticketTypesAndTheirRevenue: any = {};

    eventBookings.forEach((booking: any) => {
        const ticketType = booking.ticketType;
        if (!ticketTypesAndTheirRevenue[ticketType]) {
            ticketTypesAndTheirRevenue[ticketType] = {
                ticketsSold: 0,
                revenue: 0,
            };
        }
        ticketTypesAndTheirRevenue[ticketType].ticketsSold += Number(booking.ticketsCount) || 0;
        ticketTypesAndTheirRevenue[ticketType].revenue += Number(booking.totalAmount) || 0;
    });

    const totalRevenue = Object.keys(ticketTypesAndTheirRevenue).reduce(
        (total, ticketType) => {
            return total + ticketTypesAndTheirRevenue[ticketType].revenue;
        },
        0
    );

    const totalTicketsSold = Object.keys(ticketTypesAndTheirRevenue).reduce(
        (total, ticketType) => {
            return total + ticketTypesAndTheirRevenue[ticketType].ticketsSold;
        },
        0
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <Link href="/admin/reports" className="text-blue-600 hover:text-blue-800 font-medium">
                        ← Back to Reports
                    </Link>
                    <PageTitle title={`${event.name} - Reports`} showRefresh={true} />
                </div>
            </div>
            <div className="bg-gray-700 p-5 text-white flex flex-col gap-3 rounded-sm mb-5">
                <h1 className="md:text-3xl text-xl font-semibold">{event.name} - Reports</h1>

                <div className="text-sm flex md:flex-row flex-col gap-3 md:gap-10 text-gray-200">
                    <h1>
                        <i className="ri-map-pin-line pr-2"></i> {event.location}
                    </h1>

                    <h1>
                        <i className="ri-calendar-line pr-2"></i> {event.date} at{" "}
                        {event.time}
                    </h1>
                </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-700 mb-5">
                Ticket Types and Their Revenues
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                {Object.keys(ticketTypesAndTheirRevenue).map((ticketType) => (
                    <div key={ticketType} className="p-4 bg-white rounded-sm shadow-sm border border-gray-200">
                        <h1 className="font-semibold text-lg">{ticketType}</h1>
                        <div className="flex flex-col gap-1 mt-2 font-semibold">
                            <span className="text-sm text-gray-600 flex justify-between items-center">
                                Tickets Sold{" "}
                                <b>{ticketTypesAndTheirRevenue[ticketType].ticketsSold}</b>
                            </span>
                            <span className="text-sm text-gray-600 flex justify-between items-center">
                                Revenue{" "}
                                <b>₹{ticketTypesAndTheirRevenue[ticketType].revenue}</b>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-5 bg-white rounded-sm border border-gray-200 p-5 flex justify-between items-center shadow-sm">
                <h1 className="text-3xl font-semibold text-gray-700">Total Revenue</h1>
                <h1 className="text-3xl font-semibold text-primary">₹{totalRevenue}</h1>
            </div>

            {/* User Bookings Details */}
            <div className="mt-5 bg-white rounded-sm border border-gray-200 p-5">
                <h2 className="text-xl font-semibold mb-4">User Bookings Details</h2>
                {eventBookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-5">No bookings found for this event.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm">User Name</th>
                                    <th className="px-4 py-3 text-left text-sm">Email</th>
                                    <th className="px-4 py-3 text-left text-sm">Ticket Type</th>
                                    <th className="px-4 py-3 text-left text-sm">Tickets</th>
                                    <th className="px-4 py-3 text-left text-sm">Amount Paid</th>
                                    <th className="px-4 py-3 text-left text-sm">Payment ID</th>
                                    <th className="px-4 py-3 text-left text-sm">Booked On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventBookings.map((booking: any) => {
                                    const user = userMap.get(booking.user);
                                    return (
                                        <tr key={booking.id || booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{user?.userName || "N/A"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{user?.email || "N/A"}</td>
                                            <td className="px-4 py-3 text-sm">{booking.ticketType}</td>
                                            <td className="px-4 py-3 text-sm">{booking.ticketsCount}</td>
                                            <td className="px-4 py-3 text-sm">₹{booking.totalAmount}</td>
                                            <td className="px-4 py-3 text-sm text-xs text-gray-500">{booking.paymentId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {booking.created_at || booking.createdAt 
                                                    ? new Date(booking.created_at || booking.createdAt).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-sm p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm text-gray-600 mb-2">Total Bookings</h3>
                    <p className="text-2xl font-semibold text-gray-700">{eventBookings.length}</p>
                </div>
                <div className="bg-white rounded-sm p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm text-gray-600 mb-2">Total Tickets Sold</h3>
                    <p className="text-2xl font-semibold text-gray-700">{totalTicketsSold}</p>
                </div>
                <div className="bg-white rounded-sm p-5 border border-gray-200 shadow-sm">
                    <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
                    <p className="text-2xl font-semibold text-primary">₹{totalRevenue}</p>
                </div>
            </div>
        </div>
    );
}

export default EventReportPage;