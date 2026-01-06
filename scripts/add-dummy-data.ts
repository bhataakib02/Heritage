/**
 * Script to Add Dummy Data for Testing
 * 
 * This script creates:
 * - Dummy users (regular and admin)
 * - Dummy events/museums
 * - Dummy bookings
 * 
 * Usage:
 * npx tsx scripts/add-dummy-data.ts
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

async function addDummyUsers() {
    console.log("Creating dummy users...");
    
    const dummyUsers = [
        {
            id: generateUUID(),
            userName: "admin_user",
            email: "admin@heritage.com",
            isActive: true,
            isAdmin: true,
            clerkUserId: `clerk_admin_${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            userName: "john_doe",
            email: "john.doe@example.com",
            isActive: true,
            isAdmin: false,
            clerkUserId: `clerk_user_${Date.now()}_1`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            userName: "jane_smith",
            email: "jane.smith@example.com",
            isActive: true,
            isAdmin: false,
            clerkUserId: `clerk_user_${Date.now()}_2`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            userName: "mike_wilson",
            email: "mike.wilson@example.com",
            isActive: true,
            isAdmin: false,
            clerkUserId: `clerk_user_${Date.now()}_3`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    const { data, error } = await supabase
        .from("users")
        .upsert(dummyUsers, { onConflict: "email" })
        .select();

    if (error) {
        console.error("Error creating users:", error);
        return [];
    }

    console.log(`✓ Created ${data.length} users`);
    return data || [];
}

async function addDummyEvents(users: any[]) {
    console.log("Creating dummy events...");
    
    if (users.length === 0) {
        console.error("No users available to create events");
        return [];
    }

    const adminUser = users.find(u => u.isAdmin) || users[0];
    
    const dummyEvents = [
        {
            id: generateUUID(),
            name: "National Museum of History",
            description: "Explore the rich history of our nation through artifacts, documents, and interactive exhibits spanning centuries of cultural heritage.",
            organizer: "Ministry of Culture",
            guests: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Ambassador James Wilson"],
            location: "New Delhi, India",
            date: "2024-02-15",
            time: "10:00 AM",
            images: [
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
            ],
            ticketTypes: [
                { name: "Adult", price: 500, limit: 100 },
                { name: "Child", price: 250, limit: 50 },
                { name: "Senior", price: 300, limit: 30 },
                { name: "Student", price: 200, limit: 40 }
            ],
            user: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            name: "Art Gallery Exhibition",
            description: "A stunning collection of contemporary and classical art from renowned artists around the world. Features paintings, sculptures, and digital art installations.",
            organizer: "Heritage Arts Foundation",
            guests: ["Artist Maria Garcia", "Curator David Lee"],
            location: "Mumbai, Maharashtra",
            date: "2024-02-20",
            time: "2:00 PM",
            images: [
                "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800"
            ],
            ticketTypes: [
                { name: "General Admission", price: 400, limit: 150 },
                { name: "VIP", price: 1000, limit: 20 },
                { name: "Group (5+)", price: 300, limit: 50 }
            ],
            user: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            name: "Science and Technology Museum",
            description: "Interactive exhibits showcasing the latest innovations in science and technology. Perfect for families and science enthusiasts.",
            organizer: "Science Council",
            guests: ["Dr. Emily Brown", "Prof. Robert Taylor"],
            location: "Bangalore, Karnataka",
            date: "2024-02-25",
            time: "11:00 AM",
            images: [
                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800"
            ],
            ticketTypes: [
                { name: "Adult", price: 350, limit: 200 },
                { name: "Child (under 12)", price: 150, limit: 100 },
                { name: "Family Pack (2+2)", price: 800, limit: 30 }
            ],
            user: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            name: "Cultural Heritage Center",
            description: "Experience the diverse cultural traditions, music, dance, and crafts from different regions. Live performances and workshops available.",
            organizer: "Cultural Affairs Department",
            guests: ["Master Performer Rajesh Kumar", "Dancer Priya Sharma"],
            location: "Kolkata, West Bengal",
            date: "2024-03-01",
            time: "3:00 PM",
            images: [
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
                "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800"
            ],
            ticketTypes: [
                { name: "Standard", price: 300, limit: 120 },
                { name: "Premium", price: 600, limit: 40 },
                { name: "Workshop Access", price: 500, limit: 25 }
            ],
            user: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: generateUUID(),
            name: "Natural History Museum",
            description: "Discover the wonders of nature with exhibits on dinosaurs, wildlife, geology, and ecosystems. Educational and entertaining for all ages.",
            organizer: "Wildlife Conservation Society",
            guests: ["Dr. Lisa Anderson", "Biologist Mark Thompson"],
            location: "Chennai, Tamil Nadu",
            date: "2024-03-05",
            time: "9:00 AM",
            images: [
                "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
                "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800"
            ],
            ticketTypes: [
                { name: "Adult", price: 400, limit: 180 },
                { name: "Child", price: 200, limit: 90 },
                { name: "Senior", price: 250, limit: 50 }
            ],
            user: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    const { data, error } = await supabase
        .from("events")
        .upsert(dummyEvents, { onConflict: "id" })
        .select();

    if (error) {
        console.error("Error creating events:", error);
        return [];
    }

    console.log(`✓ Created ${data.length} events`);
    return data || [];
}

async function addDummyBookings(users: any[], events: any[]) {
    console.log("Creating dummy bookings...");
    
    if (users.length === 0 || events.length === 0) {
        console.error("Need users and events to create bookings");
        return [];
    }

    const regularUsers = users.filter(u => !u.isAdmin);
    const dummyBookings = [];

    // Create bookings for different users and events
    for (let i = 0; i < Math.min(regularUsers.length, events.length); i++) {
        const user = regularUsers[i];
        const event = events[i];
        const ticketType = event.ticketTypes[0];

        dummyBookings.push({
            id: generateUUID(),
            event: event.id,
            user: user.id,
            paymentId: `pay_${Date.now()}_${i}_1`,
            ticketType: ticketType.name,
            ticketsCount: Math.floor(Math.random() * 3) + 1, // 1-3 tickets
            totalAmount: ticketType.price * (Math.floor(Math.random() * 3) + 1),
            status: "booked",
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 7 days
            updated_at: new Date().toISOString(),
        });

        // Add another booking for the same user
        if (i < events.length - 1) {
            const nextEvent = events[i + 1];
            const nextTicketType = nextEvent.ticketTypes[0];
            dummyBookings.push({
                id: generateUUID(),
                event: nextEvent.id,
                user: user.id,
                paymentId: `pay_${Date.now()}_${i}_2`,
                ticketType: nextTicketType.name,
                ticketsCount: Math.floor(Math.random() * 2) + 1,
                totalAmount: nextTicketType.price * (Math.floor(Math.random() * 2) + 1),
                status: i % 3 === 0 ? "cancelled" : "booked", // Some cancelled bookings
                created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
    }

    // Add some bookings for the first event (most popular)
    if (events.length > 0 && regularUsers.length > 0) {
        const popularEvent = events[0];
        for (let i = 0; i < Math.min(3, regularUsers.length); i++) {
            const user = regularUsers[i];
            const ticketType = popularEvent.ticketTypes[Math.floor(Math.random() * popularEvent.ticketTypes.length)];
            dummyBookings.push({
                id: generateUUID(),
                event: popularEvent.id,
                user: user.id,
                paymentId: `pay_${Date.now()}_popular_${i}`,
                ticketType: ticketType.name,
                ticketsCount: Math.floor(Math.random() * 4) + 1,
                totalAmount: ticketType.price * (Math.floor(Math.random() * 4) + 1),
                status: "booked",
                created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
    }

    const { data, error } = await supabase
        .from("bookings")
        .upsert(dummyBookings, { onConflict: "id" })
        .select();

    if (error) {
        console.error("Error creating bookings:", error);
        return [];
    }

    console.log(`✓ Created ${data.length} bookings`);
    return data || [];
}

async function main() {
    try {
        console.log("Starting to add dummy data...\n");

        // Step 1: Create users
        const users = await addDummyUsers();
        console.log("");

        // Step 2: Create events
        const events = await addDummyEvents(users);
        console.log("");

        // Step 3: Create bookings
        const bookings = await addDummyBookings(users, events);
        console.log("");

        console.log("✓ Dummy data added successfully!");
        console.log("\nSummary:");
        console.log(`  - Users: ${users.length} (1 admin, ${users.length - 1} regular)`);
        console.log(`  - Events: ${events.length}`);
        console.log(`  - Bookings: ${bookings.length}`);
        console.log("\nYou can now test the application with this data!");

    } catch (error: any) {
        console.error("Error adding dummy data:", error);
        process.exit(1);
    }
}

// Run the script
main();

