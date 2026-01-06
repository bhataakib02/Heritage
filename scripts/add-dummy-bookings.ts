/**
 * Script to Add Dummy Bookings to Existing Events and Users
 * 
 * This script creates multiple bookings for existing users and events
 * 
 * Usage:
 * npx tsx scripts/add-dummy-bookings.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generate UUID helper
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function addDummyBookings() {
    console.log("Fetching existing users and events...");

    // Fetch all users (excluding admin for bookings)
    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, userName, email, isAdmin")
        .eq("isAdmin", false);

    if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
    }

    if (!users || users.length === 0) {
        console.error("No regular users found. Please create users first.");
        return;
    }

    // Fetch all events
    const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, name, ticketTypes");

    if (eventsError) {
        console.error("Error fetching events:", eventsError);
        return;
    }

    if (!events || events.length === 0) {
        console.error("No events found. Please create events first.");
        return;
    }

    console.log(`Found ${users.length} users and ${events.length} events`);
    console.log("Creating dummy bookings...\n");

    const dummyBookings = [];
    const statuses = ["booked", "booked", "booked", "cancelled"]; // 75% booked, 25% cancelled

    // Create multiple bookings for each user across different events
    users.forEach((user, userIndex) => {
        // Each user gets 2-5 bookings
        const numBookings = Math.floor(Math.random() * 4) + 2;

        for (let i = 0; i < numBookings; i++) {
            // Random event
            const event = events[Math.floor(Math.random() * events.length)];
            
            // Random ticket type from event
            if (!event.ticketTypes || event.ticketTypes.length === 0) continue;
            const ticketType = event.ticketTypes[Math.floor(Math.random() * event.ticketTypes.length)];
            
            // Random ticket count (1-5)
            const ticketsCount = Math.floor(Math.random() * 5) + 1;
            
            // Calculate total amount
            const totalAmount = ticketType.price * ticketsCount;
            
            // Random status (mostly booked)
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Random date in the last 30 days
            const daysAgo = Math.floor(Math.random() * 30);
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - daysAgo);
            createdDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

            dummyBookings.push({
                id: generateUUID(),
                event: event.id,
                user: user.id,
                paymentId: `pay_${Date.now()}_${userIndex}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                ticketType: ticketType.name,
                ticketsCount: ticketsCount,
                totalAmount: totalAmount,
                status: status,
                created_at: createdDate.toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
    });

    // Add some extra bookings for popular events (first few events)
    const popularEvents = events.slice(0, Math.min(3, events.length));
    popularEvents.forEach((event, eventIndex) => {
        if (!event.ticketTypes || event.ticketTypes.length === 0) return;
        
        // Add 3-6 extra bookings per popular event
        const extraBookings = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < extraBookings; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const ticketType = event.ticketTypes[Math.floor(Math.random() * event.ticketTypes.length)];
            const ticketsCount = Math.floor(Math.random() * 4) + 1;
            const totalAmount = ticketType.price * ticketsCount;
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            const daysAgo = Math.floor(Math.random() * 15);
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - daysAgo);
            createdDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

            dummyBookings.push({
                id: generateUUID(),
                event: event.id,
                user: user.id,
                paymentId: `pay_${Date.now()}_popular_${eventIndex}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                ticketType: ticketType.name,
                ticketsCount: ticketsCount,
                totalAmount: totalAmount,
                status: status,
                created_at: createdDate.toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
    });

    console.log(`Creating ${dummyBookings.length} bookings...`);

    // Insert bookings in batches of 50 to avoid overwhelming the database
    const batchSize = 50;
    let createdCount = 0;

    for (let i = 0; i < dummyBookings.length; i += batchSize) {
        const batch = dummyBookings.slice(i, i + batchSize);
        
        const { data, error } = await supabase
            .from("bookings")
            .insert(batch)
            .select();

        if (error) {
            console.error(`Error creating bookings batch ${Math.floor(i / batchSize) + 1}:`, error);
        } else {
            createdCount += data?.length || 0;
            console.log(`✓ Created batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} bookings`);
        }
    }

    console.log(`\n✓ Successfully created ${createdCount} bookings!`);
    
    // Show summary
    const bookedCount = dummyBookings.filter(b => b.status === 'booked').length;
    const cancelledCount = dummyBookings.filter(b => b.status === 'cancelled').length;
    
    console.log("\nSummary:");
    console.log(`  - Total bookings: ${createdCount}`);
    console.log(`  - Booked: ${bookedCount}`);
    console.log(`  - Cancelled: ${cancelledCount}`);
    console.log(`  - Total revenue (booked): ₹${dummyBookings.filter(b => b.status === 'booked').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}`);
}

async function main() {
    try {
        await addDummyBookings();
        console.log("\n✓ Dummy bookings added successfully!");
    } catch (error: any) {
        console.error("Error adding dummy bookings:", error);
        process.exit(1);
    }
}

// Run the script
main();

