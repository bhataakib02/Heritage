import PageTitle from "@/components/PageTitle";
import { connectDB } from "@/config/dbConfig";
import EventModel from "@/models/event-model";
import BookingModel from "@/models/booking-model";
import UserModel from "@/models/user-model";
import React from "react";
import dayjs from "dayjs";
import Link from "next/link";

connectDB();

async function AdminDashboard() {
    try {
        // Fetch all data in parallel
        const [events, bookings, users] = await Promise.all([
            EventModel.find({}),
            BookingModel.find({}),
            UserModel.find({}),
        ]);

        // Calculate metrics
        const totalEvents = events.length;
        const totalBookings = bookings.length;
        const totalUsers = users.length;
        const activeBookings = bookings.filter((b: any) => b.status === 'booked').length;
        const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length;

        // Revenue calculations
        const totalRevenue = bookings
            .filter((b: any) => b.status === 'booked')
            .reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayBookings = bookings.filter((b: any) => {
            const bookingDate = new Date(b.created_at || b.createdAt);
            return bookingDate >= today && b.status === 'booked';
        });
        const todayRevenue = todayBookings.reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0);

        // This week
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekBookings = bookings.filter((b: any) => {
            const bookingDate = new Date(b.created_at || b.createdAt);
            return bookingDate >= weekStart && b.status === 'booked';
        });
        const weekRevenue = weekBookings.reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0);

        // This month
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthBookings = bookings.filter((b: any) => {
            const bookingDate = new Date(b.created_at || b.createdAt);
            return bookingDate >= monthStart && b.status === 'booked';
        });
        const monthRevenue = monthBookings.reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0);

        // Upcoming events
        const upcomingEvents = events.filter((e: any) => {
            const eventDate = new Date(e.date);
            return eventDate >= today;
        });

        // Recent bookings (last 5)
        const recentBookings = bookings
            .sort((a: any, b: any) => {
                const dateA = new Date(a.created_at || a.createdAt).getTime();
                const dateB = new Date(b.created_at || b.createdAt).getTime();
                return dateB - dateA;
            })
            .slice(0, 5);

        // Top events by revenue
        const eventRevenue = new Map<string, number>();
        bookings
            .filter((b: any) => b.status === 'booked')
            .forEach((booking: any) => {
                const eventId = booking.event;
                const current = eventRevenue.get(eventId) || 0;
                eventRevenue.set(eventId, current + (Number(booking.totalAmount) || 0));
            });

        const topEvents = Array.from(eventRevenue.entries())
            .map(([eventId, revenue]) => {
                const event = events.find((e: any) => (e.id || e._id) === eventId);
                return { event, revenue };
            })
            .filter(item => item.event)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const StatCard = ({ title, value, icon, link }: { title: string; value: string | number; icon: string; link?: string }) => {
            const content = (
                <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm text-gray-600 font-medium">{title}</h3>
                        <i className={`${icon} text-2xl text-gray-400`}></i>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
            );

            if (link) {
                return <Link href={link}>{content}</Link>;
            }
            return content;
        };

        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="Dashboard" showRefresh={true} />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${totalRevenue.toLocaleString()}`}
                        icon="ri-money-dollar-circle-line"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={totalBookings}
                        icon="ri-calendar-check-line"
                        link="/admin/bookings"
                    />
                    <StatCard
                        title="Total Events"
                        value={totalEvents}
                        icon="ri-museum-line"
                        link="/admin/events"
                    />
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon="ri-user-line"
                        link="/admin/users"
                    />
                </div>

                {/* Revenue Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                        <h3 className="text-sm text-gray-600 mb-2">Today's Revenue</h3>
                        <p className="text-2xl font-bold text-primary">₹{todayRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">{todayBookings.length} bookings</p>
                    </div>
                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                        <h3 className="text-sm text-gray-600 mb-2">This Week's Revenue</h3>
                        <p className="text-2xl font-bold text-primary">₹{weekRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">{weekBookings.length} bookings</p>
                    </div>
                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                        <h3 className="text-sm text-gray-600 mb-2">This Month's Revenue</h3>
                        <p className="text-2xl font-bold text-primary">₹{monthRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">{monthBookings.length} bookings</p>
                    </div>
                </div>

                {/* Booking Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Active Bookings</span>
                                <span className="text-lg font-semibold text-green-600">{activeBookings}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Cancelled Bookings</span>
                                <span className="text-lg font-semibold text-red-600">{cancelledBookings}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-semibold">Total</span>
                                <span className="text-xl font-bold">{totalBookings}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                        <p className="text-3xl font-bold text-primary">{upcomingEvents.length}</p>
                        <p className="text-sm text-gray-500 mt-2">Events scheduled for future dates</p>
                    </div>
                </div>

                {/* Top Events by Revenue */}
                {topEvents.length > 0 && (
                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm mb-5">
                        <h3 className="text-lg font-semibold mb-4">Top Events by Revenue</h3>
                        <div className="space-y-3">
                            {topEvents.map((item, index) => (
                                <div key={item.event?.id || item.event?._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 font-bold">#{index + 1}</span>
                                        <span className="font-medium">{(item.event as any)?.name}</span>
                                    </div>
                                    <span className="font-semibold text-primary">₹{item.revenue.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Bookings */}
                {recentBookings.length > 0 && (
                    <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Recent Bookings</h3>
                            <Link href="/admin/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {recentBookings.map((booking: any) => {
                                const event = events.find((e: any) => (e.id || e._id) === booking.event);
                                const user = users.find((u: any) => (u.id || u._id) === booking.user);
                                return (
                                    <div key={booking.id || booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-sm text-sm">
                                        <div>
                                            <span className="font-medium">{(event as any)?.name || "Event"}</span>
                                            <span className="text-gray-500 ml-2">by {(user as any)?.userName || "User"}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-600">₹{booking.totalAmount}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                booking.status === 'booked' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error: any) {
        return (
            <div>
                <div className="mb-5">
                    <PageTitle title="Dashboard" showRefresh={true} />
                </div>
                <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                    <p className="text-red-500 text-lg font-semibold mb-2">Error loading dashboard</p>
                    <p className="text-gray-500 text-sm">{error.message || "Please check your database connection and try again."}</p>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;

