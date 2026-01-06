import {
  getUserIdOfLoggedInUser,
  handleNewUserRegistration,
} from "@/actions/users";
import Filters from "@/components/Filters";
import { connectDB } from "@/config/dbConfig";
import { EventType } from "@/interfaces/events";
import EventModel from "@/models/event-model";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Don't call connectDB at module level - it can cause issues
// connectDB();

// Force dynamic rendering - this page uses auth() which requires headers
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: {
    name: string;
    date: string;
  };
}

export default async function Home({ searchParams }: Props) {
  // Check if user is authenticated
  const { userId } = await auth();
  
  // If not authenticated, redirect to landing page
  if (!userId) {
    redirect("/");
  }

  // Fetch events first (most important)
  let events: EventType[] = [];
  try {
    events = (await EventModel.find({}, {
      sort: { created_at: -1 }
    })) as any;
  } catch (error: any) {
    console.error("Error fetching events:", error);
    events = [];
  }

  // Handle user registration and DB connection in background (don't block)
  Promise.all([
    connectDB().catch(() => {}),
    handleNewUserRegistration().catch(() => {}),
    getUserIdOfLoggedInUser().catch(() => {})
  ]).catch(() => {}); // Ignore all errors

  // Apply filters if provided
  let filteredEvents = events;
  if (searchParams.name) {
    const nameFilter = searchParams.name.toLowerCase();
    filteredEvents = filteredEvents.filter((event: any) =>
      event.name?.toLowerCase().includes(nameFilter)
    );
  }

  if (searchParams.date) {
    filteredEvents = filteredEvents.filter((event: any) =>
      event.date === searchParams.date
    );
  }
  return (
    <div>
      <Filters />
      <div className="flex flex-col gap-5">
        {filteredEvents.map((event) => (
          <div
            key={event.id || (event as any)._id}
            className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-sm md:gap-10 border border-gray-200"
          >
            <div className="col-span-1">
              <img
                src={event.images?.[0] || '/placeholder-image.jpg'}
                alt="Picture of the museum"
                height={130}
                width={250}
                className="w-full object-contain rounded-l-sm"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-5 justify-between p-5">
              <h1 className="font-semibold text-gray-700">{event.name}</h1>
              <p className="text-gray-500 w-full line-clamp-3 text-sm">
                {event.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <h1>
                    <i className="ri-map-pin-line pr-5"></i> {event.location}
                  </h1>

                  <h1>
                    <i className="ri-calendar-line pr-5"></i> {event.date} at{" "}
                    {event.time}
                  </h1>
                </div>

                <Link
                  className="bg-primary text-white px-5 py-2 rounded-sm text-sm"
                  href={`/book-event/${event.id || (event as any)._id}`}
                >
                  View Museum
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="w-full mt-100 flex justify-center">
          <h1 className="text-sm">
            {events.length === 0 ? "No museums available" : "No museums found for your search"}
          </h1>
        </div>
      )}
    </div>
  );
}