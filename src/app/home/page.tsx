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

connectDB();

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

  try {
    await handleNewUserRegistration();
  } catch (error) {
    // Silently handle registration errors (user might not be logged in)
    console.log("User registration check:", error);
  }

  try {
    await getUserIdOfLoggedInUser();
  } catch (error) {
    // Silently handle - user might not be logged in yet
    console.log("User ID check:", error);
  }

  let filters: any = {};
  if (searchParams.name) {
    filters = {
      name: {
        $regex: searchParams.name,
        $options: "i",
      },
    };
  }

  if (searchParams.date) {
    filters = {
      ...filters,
      date: searchParams.date,
    };
  }

  let events: EventType[] = [];
  try {
    events = (await EventModel.find(filters, {
      sort: { created_at: -1 }
    })) as any;
  } catch (error: any) {
    console.error("Error fetching events:", error);
    // Return empty array on error instead of crashing
    events = [];
  }
  return (
    <div>
      <Filters />
      <div className="flex flex-col gap-5">
        {events.map((event) => (
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

      {events.length === 0 && (
        <div className="w-full mt-100 flex justify-center">
          <h1 className="text-sm">
            No museums found for your search
          </h1>
        </div>
      )}
    </div>
  );
}