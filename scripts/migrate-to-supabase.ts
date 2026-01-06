/**
 * Migration Script: MongoDB to Supabase
 * 
 * This script migrates all data from MongoDB to Supabase
 * 
 * Usage:
 * 1. Set MONGO_URL in .env.local (temporary, for migration only)
 * 2. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
 * 3. Run: npx tsx scripts/migrate-to-supabase.ts
 */

import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGO_URL = process.env.MONGO_URL || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!MONGO_URL) {
    console.error("Error: MONGO_URL not found in environment variables");
    process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables");
    process.exit(1);
}

// MongoDB Schemas (for reading data)
const userSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const eventSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const bookingSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const UserModel = mongoose.model("users", userSchema);
const EventModel = mongoose.model("events", eventSchema);
const BookingModel = mongoose.model("bookings", bookingSchema);

// Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to generate UUID (for Node.js)
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Helper to convert MongoDB ObjectId to UUID or generate new UUID
function convertId(oldId: any): string {
    // For Supabase, we'll generate new UUIDs
    return generateUUID();
}

// Create ID mapping
const userIdMap = new Map<string, string>(); // MongoDB _id -> Supabase id
const eventIdMap = new Map<string, string>();

async function migrateUsers() {
    console.log("Migrating users...");
    const users = await UserModel.find({});
    console.log(`Found ${users.length} users to migrate`);

    const supabaseUsers = [];
    for (const user of users) {
        const newId = convertId(user._id);
        userIdMap.set(user._id.toString(), newId);

        supabaseUsers.push({
            id: newId,
            userName: user.userName,
            email: user.email,
            isActive: user.isActive ?? true,
            isAdmin: user.isAdmin ?? false,
            clerkUserId: user.clerkUserId,
            created_at: user.createdAt?.toISOString() || new Date().toISOString(),
            updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
        });
    }

    if (supabaseUsers.length > 0) {
        const { error } = await supabase.from("users").upsert(supabaseUsers, { onConflict: "clerkUserId" });
        if (error) {
            console.error("Error migrating users:", error);
        } else {
            console.log(`✓ Migrated ${supabaseUsers.length} users`);
        }
    }
}

async function migrateEvents() {
    console.log("Migrating events...");
    const events = await EventModel.find({});
    console.log(`Found ${events.length} events to migrate`);

    const supabaseEvents = [];
    for (const event of events) {
        const newId = convertId(event._id);
        eventIdMap.set(event._id.toString(), newId);

        // Map user reference
        const userId = userIdMap.get(event.user?.toString() || "");
        if (!userId) {
            console.warn(`Event ${event._id} references unknown user ${event.user}, skipping...`);
            continue;
        }

        supabaseEvents.push({
            id: newId,
            name: event.name,
            description: event.description,
            organizer: event.organizer,
            guests: event.guests || [],
            location: event.location,
            date: event.date,
            time: event.time,
            images: event.images || [],
            ticketTypes: event.ticketTypes || [],
            user: userId,
            created_at: event.createdAt?.toISOString() || new Date().toISOString(),
            updated_at: event.updatedAt?.toISOString() || new Date().toISOString(),
        });
    }

    if (supabaseEvents.length > 0) {
        const { error } = await supabase.from("events").upsert(supabaseEvents);
        if (error) {
            console.error("Error migrating events:", error);
        } else {
            console.log(`✓ Migrated ${supabaseEvents.length} events`);
        }
    }
}

async function migrateBookings() {
    console.log("Migrating bookings...");
    const bookings = await BookingModel.find({});
    console.log(`Found ${bookings.length} bookings to migrate`);

    const supabaseBookings = [];
    for (const booking of bookings) {
        // Map event reference
        const eventId = eventIdMap.get(booking.event?.toString() || "");
        if (!eventId) {
            console.warn(`Booking ${booking._id} references unknown event ${booking.event}, skipping...`);
            continue;
        }

        // Map user reference
        const userId = userIdMap.get(booking.user?.toString() || "");
        if (!userId) {
            console.warn(`Booking ${booking._id} references unknown user ${booking.user}, skipping...`);
            continue;
        }

        supabaseBookings.push({
            id: convertId(booking._id),
            event: eventId,
            user: userId,
            paymentId: booking.paymentId,
            ticketType: booking.ticketType,
            ticketsCount: booking.ticketsCount,
            totalAmount: booking.totalAmount,
            status: booking.status || "booked",
            created_at: booking.createdAt?.toISOString() || new Date().toISOString(),
            updated_at: booking.updatedAt?.toISOString() || new Date().toISOString(),
        });
    }

    if (supabaseBookings.length > 0) {
        const { error } = await supabase.from("bookings").upsert(supabaseBookings);
        if (error) {
            console.error("Error migrating bookings:", error);
        } else {
            console.log(`✓ Migrated ${supabaseBookings.length} bookings`);
        }
    }
}

async function main() {
    try {
        console.log("Starting migration from MongoDB to Supabase...\n");

        // Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URL);
        console.log("✓ Connected to MongoDB\n");

        // Migrate in order: users -> events -> bookings
        await migrateUsers();
        await migrateEvents();
        await migrateBookings();

        console.log("\n✓ Migration completed successfully!");
        console.log("\nNext steps:");
        console.log("1. Verify data in Supabase dashboard");
        console.log("2. Remove MONGO_URL from .env.local");
        console.log("3. Update your application to use Supabase only");

    } catch (error: any) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    }
}

// Run migration
main();

