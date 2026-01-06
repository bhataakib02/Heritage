import PageTitle from '@/components/PageTitle'
import { EventType } from '@/interfaces/events'
import EventModel from '@/models/event-model'
import { Link } from '@nextui-org/react'
import React from 'react'
import EventsTableWithFeatures from './_components/events-table-with-features'
import { connectDB } from '@/config/dbConfig'
connectDB()

async function EventsPage() {
    try {
        const events: EventType[] = (await EventModel.find({}, {
            sort: { created_at: -1 }
        })) as any;

        return (
            <div>
                <div className="flex justify-between items-center mb-5">
                    <PageTitle title="Museum" showRefresh={true} />
                    <Link 
                        href="/admin/events/new-event"
                        className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Add Museum
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                        <p className="text-gray-500 text-lg mb-2">No museums/events found.</p>
                        <p className="text-gray-400 text-sm mb-5">Click "Add Museum" to create your first event.</p>
                        <Link 
                            href="/admin/events/new-event"
                            className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors inline-block"
                        >
                            Add Your First Museum
                        </Link>
                    </div>
                ) : (
                    <EventsTableWithFeatures events={JSON.parse(JSON.stringify(events))} />
                )}
            </div>
        );
    } catch (error: any) {
        console.error("Error loading events:", error);
        return (
            <div>
                <div className="flex justify-between items-center mb-5">
                    <PageTitle title="Museum" showRefresh={true} />
                    <Link 
                        href="/admin/events/new-event"
                        className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Add Museum
                    </Link>
                </div>
                <div className="mt-5 text-center py-10 bg-white rounded-sm border border-gray-200">
                    <p className="text-red-500 text-lg mb-2 font-semibold">Error loading events</p>
                    <p className="text-gray-500 text-sm">{error.message || "Please check your database connection and try again."}</p>
                    <p className="text-gray-400 text-xs mt-3">
                        Make sure your Supabase credentials are set in .env.local
                    </p>
                </div>
            </div>
        );
    }
}

export default EventsPage;