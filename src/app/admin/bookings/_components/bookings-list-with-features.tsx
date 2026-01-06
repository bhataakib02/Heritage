"use client";
import { BookingType } from "@/interfaces/events";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import CancelBookingBtn from "./cancel-booking-button";
import SearchBar from "@/components/admin/SearchBar";
import ExportButton from "@/components/admin/ExportButton";
import Pagination from "@/components/admin/Pagination";
import TableFilters from "@/components/admin/TableFilters";

function BookingsListWithFeatures({ bookings }: { bookings: BookingType[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        status: "",
    });
    const itemsPerPage = 10;

    // Filter and search
    const filteredBookings = useMemo(() => {
        let filtered = bookings;
        
        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(booking => {
                const eventName = (booking.event as any)?.name || "";
                const userName = (booking.user as any)?.userName || "";
                const userEmail = (booking.user as any)?.email || "";
                const searchLower = searchTerm.toLowerCase();
                return (
                    eventName.toLowerCase().includes(searchLower) ||
                    userName.toLowerCase().includes(searchLower) ||
                    userEmail.toLowerCase().includes(searchLower) ||
                    booking.paymentId?.toLowerCase().includes(searchLower)
                );
            });
        }
        
        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(booking => booking.status === filters.status);
        }
        
        return filtered;
    }, [bookings, searchTerm, filters]);

    // Paginate
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(start, start + itemsPerPage);
    }, [filteredBookings, currentPage]);

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: "" });
        setSearchTerm("");
        setCurrentPage(1);
    };

    const getProperty = ({ key, value }: { key: string; value: any }) => {
        return (
            <div>
                <h1 className="font-semibold text-sm text-gray-600 mb-1">{key}</h1>
                <h1 className="text-gray-700 text-sm">{value || "N/A"}</h1>
            </div>
        );
    };

    const filterOptions = [
        {
            key: "status",
            label: "Status",
            type: "select" as const,
            options: [
                { value: "", label: "All Statuses" },
                { value: "booked", label: "Booked" },
                { value: "cancelled", label: "Cancelled" },
            ],
        },
    ];

    // Prepare export data
    const exportData = filteredBookings.map((booking: any) => ({
        "Museum Name": (booking.event as any)?.name || "N/A",
        "User Name": (booking.user as any)?.userName || "N/A",
        "User Email": (booking.user as any)?.email || "N/A",
        "Ticket Type": booking.ticketType,
        "Tickets Count": booking.ticketsCount,
        "Total Amount": booking.totalAmount,
        "Payment ID": booking.paymentId,
        "Status": booking.status,
        "Booked On": booking.createdAt ? dayjs(booking.createdAt).format("DD/MM/YYYY hh:mm A") : "N/A",
    }));

    return (
        <>
            <div className="mb-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Search bookings by museum, user, or payment ID..."
                        onSearch={setSearchTerm}
                    />
                </div>
                <ExportButton
                    data={exportData}
                    filename="bookings"
                />
            </div>

            <TableFilters
                filters={filterOptions}
                values={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
            />

            <div className="flex flex-col gap-5 mt-5">
                {paginatedBookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="border border-gray-200 bg-white rounded-sm shadow-sm flex flex-col gap-5 overflow-hidden"
                    >
                        <div className="bg-gray-700 p-4 text-white flex md:flex-row flex-col justify-between md:items-center">
                            <div className="lg:w-full">
                                <h1 className="md:text-2xl text-xl font-semibold w-full">
                                    {(typeof booking?.event === 'object' && booking?.event?.name) || "Museum name not available"}
                                </h1>
                                <div className="text-sm flex md:flex-row flex-col gap-5 md:gap-10 text-gray-200">
                                    <h1>
                                        <i className="ri-map-pin-line pr-2"></i>{" "}
                                        {(typeof booking?.event === 'object' && booking?.event?.location) || "Location not available"}
                                    </h1>
                                    <h1>
                                        <i className="ri-calendar-line pr-2"></i>{" "}
                                        {(typeof booking?.event === 'object' && booking?.event?.date) || "Date not available"} at {(typeof booking?.event === 'object' && booking?.event?.time) || "Time not available"}
                                    </h1>
                                </div>
                            </div>

                            {booking.status !== "cancelled" && (
                                <CancelBookingBtn
                                    booking={JSON.parse(JSON.stringify(booking))}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4">
                            {getProperty({ key: "Booking Id", value: booking._id })}
                            {getProperty({ 
                                key: "User", 
                                value: (booking.user as any)?.userName 
                                    ? (
                                        <Link 
                                            href={`/admin/users/${(booking.user as any)?.id || (booking.user as any)?._id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {(booking.user as any)?.userName}
                                        </Link>
                                    )
                                    : "N/A"
                            })}
                            {getProperty({
                                key: "User Email",
                                value: (booking.user as any)?.email || "N/A",
                            })}
                            {getProperty({ key: "Ticket Type", value: booking.ticketType })}
                            {getProperty({
                                key: "Tickets Count",
                                value: booking.ticketsCount,
                            })}
                            {getProperty({
                                key: "Total Price",
                                value: `₹${booking.totalAmount}`,
                            })}
                            {getProperty({ key: "Payment Id", value: booking.paymentId })}
                            {getProperty({
                                key: "Booked On",
                                value: booking.createdAt ? dayjs(booking.createdAt).format("DD/MM/YYYY hh:mm A") : "N/A",
                            })}
                            {getProperty({
                                key: "Status",
                                value: (
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        booking.status === 'booked' 
                                            ? 'bg-green-100 text-green-800' 
                                            : booking.status === 'cancelled'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {booking.status || "booked"}
                                    </span>
                                ),
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-10 bg-white rounded-sm border border-gray-200 mt-5">
                    <p className="text-gray-500 text-lg">
                        {searchTerm || filters.status ? "No bookings found matching your criteria." : "No bookings found."}
                    </p>
                </div>
            )}

            {filteredBookings.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredBookings.length}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </>
    );
}

export default BookingsListWithFeatures;

