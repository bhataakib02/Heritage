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

// Create Supabase model adapter
const supabase = getSupabaseClient();
const EventModel: IModel<Event> = new SupabaseModelAdapter<Event>(supabase, 'events', 'id');

export default EventModel;
