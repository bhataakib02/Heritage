import { getMongoDBUserIDOfLoggedInUser } from "@/actions/users";
import PageTitle from "@/components/PageTitle";
import { connectDB } from "@/config/dbConfig";
import { BookingType, EventType } from "@/interfaces/events";
import BookingModel from "@/models/booking-model";
import EventModel from "@/models/event-model";
import dayjs from "dayjs";

import React from "react";
connectDB();
async function BookingsPage() {
  const mongoUserId = await getMongoDBUserIDOfLoggedInUser();
  const bookings = await BookingModel.find({
    user: mongoUserId,
  });
  
  // Populate events manually (Supabase doesn't have .populate())
  const eventIds = Array.from(new Set(bookings.map((b: any) => b.event).filter(Boolean)));
  const events = [];
  for (const eventId of eventIds) {
    const event = await EventModel.findById(eventId);
    if (event) events.push(event);
  }
  
  const eventMap = new Map(events.map((e: any) => [(e.id || e._id), e]));
  const bookedEvents: BookingType[] = bookings.map((booking: any) => ({
    ...booking,
    event: eventMap.get(booking.event) || booking.event,
    _id: booking.id || booking._id,
    createdAt: booking.created_at || booking.createdAt
  })) as any;
  
  console.log(bookedEvents)
  const getProperty = ({ key, value }: { key: string; value: any }) => {
    return (
      <div>
        <h1 className="font-semibold">{key}</h1>
        <h1 className="text-gray-700 text-sm">{value}</h1>
      </div>
    );
  };

  return (
    <div>
      <PageTitle title="My Bookings" />
      <div className="flex flex-col gap-5 mt-5">
        {bookedEvents.map((booking) => {
          return (
            <div
              key={booking._id}
              className="border border-gray-300 bg-gray-100 flex flex-col gap-5"
            >
              <div className="bg-gray-700 p-3 text-white ">
                <h1 className="text-2xl font-semibold">{(typeof booking?.event === 'object' ? booking.event?.name : null) || "Event name not available"}</h1>
                <div className="text-sm flex gap-10 text-gray-200">
                  <h1>
                    <i className="ri-map-pin-line pr-2"></i> {(typeof booking?.event === 'object' ? booking.event?.location : null) || "Location not available"}
                  </h1>
                  <h1>
                    <i className="ri-calendar-line pr-2"></i> {(typeof booking?.event === 'object' ? booking.event?.date : null) || "Date not available"} at {(typeof booking?.event === 'object' ? booking.event?.time : null) || "Time not available"}
                  </h1>
               </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-3">
                {getProperty({ key: "Booking Id", value: booking._id })}
                {getProperty({ key: "Ticket Type", value: booking.ticketType })}
                {getProperty({
                  key: "Tickets Count",
                  value: booking.ticketsCount,
                })}
                {getProperty({
                  key: "Total Price",
                  value: booking.totalAmount,
                })}
                {getProperty({ key: "Payment Id", value: booking.paymentId })}

                {getProperty({
                  key: "Booked On",
                  value: dayjs(booking.createdAt).format("DD/MM/YYYY hh:mm A"),
                })}
                {getProperty({
                  key: "Status",
                  value: booking.status || "booked",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookingsPage;