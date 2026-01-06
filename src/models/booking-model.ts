/**
 * Booking Model - Supabase only
 */

import { getSupabaseClient } from "@/config/supabase";
import { IModel } from "@/lib/db/interface";
import { SupabaseModelAdapter } from "@/lib/db/supabase-adapter";

// Booking interface
export interface Booking {
    id?: string;
    event: string; // Event ID reference (UUID)
    user: string; // User ID reference (UUID)
    paymentId: string;
    ticketType: string;
    ticketsCount: number;
    totalAmount: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}

// Create Supabase model adapter
const supabase = getSupabaseClient();
const BookingModel: IModel<Booking> = new SupabaseModelAdapter<Booking>(supabase, 'bookings', 'id');

export default BookingModel;
