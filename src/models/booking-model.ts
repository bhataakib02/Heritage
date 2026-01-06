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

// Lazy initialization - only create client when model is used
let bookingModelInstance: IModel<Booking> | null = null;

function getBookingModel(): IModel<Booking> {
    if (!bookingModelInstance) {
        const supabase = getSupabaseClient();
        bookingModelInstance = new SupabaseModelAdapter<Booking>(supabase, 'bookings', 'id');
    }
    return bookingModelInstance;
}

const BookingModel = new Proxy({} as IModel<Booking>, {
    get(target, prop) {
        return getBookingModel()[prop as keyof IModel<Booking>];
    }
});

export default BookingModel;
