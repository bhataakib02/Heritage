/**
 * Event Model - Supabase only
 */

import { getSupabaseClient } from "@/config/supabase";
import { IModel } from "@/lib/db/interface";
import { SupabaseModelAdapter } from "@/lib/db/supabase-adapter";

// Event interface
export interface Event {
    id?: string;
    name: string;
    description: string;
    organizer: string;
    guests: any[];
    location: string;
    date: string;
    time: string;
    images: string[];
    ticketTypes: any[];
    user: string; // User ID reference (UUID)
    created_at?: string;
    updated_at?: string;
}

// Lazy initialization - only create client when model is used
let eventModelInstance: IModel<Event> | null = null;

function getEventModel(): IModel<Event> {
    if (!eventModelInstance) {
const supabase = getSupabaseClient();
        eventModelInstance = new SupabaseModelAdapter<Event>(supabase, 'events', 'id');
    }
    return eventModelInstance;
}

const EventModel = new Proxy({} as IModel<Event>, {
    get(target, prop) {
        return getEventModel()[prop as keyof IModel<Event>];
    }
});

export default EventModel;
