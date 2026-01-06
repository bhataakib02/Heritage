/**
 * Script to make a user an admin
 * 
 * Usage:
 * 1. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
 * 2. Run: npx tsx scripts/make-user-admin.ts <clerkUserId or email>
 * 
 * Example:
 * npx tsx scripts/make-user-admin.ts user_abc123
 * or
 * npx tsx scripts/make-user-admin.ts user@example.com
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

async function makeUserAdmin(identifier: string) {
    try {
        console.log(`Looking for user with identifier: ${identifier}...`);

        // Try to find user by clerkUserId or email
        let query = supabase.from("users").select("*");
        
        // Check if identifier looks like an email
        if (identifier.includes("@")) {
            query = query.eq("email", identifier);
        } else {
            query = query.eq("clerkUserId", identifier);
        }

        const { data: users, error: findError } = await query;

        if (findError) {
            console.error("Error finding user:", findError);
            process.exit(1);
        }

        if (!users || users.length === 0) {
            console.error(`No user found with identifier: ${identifier}`);
            console.log("\nAvailable users:");
            
            // List all users
            const { data: allUsers } = await supabase.from("users").select("email, clerkUserId, userName, isAdmin");
            if (allUsers && allUsers.length > 0) {
                allUsers.forEach((user: any) => {
                    console.log(`  - Email: ${user.email}, Clerk ID: ${user.clerkUserId}, Username: ${user.userName}, Admin: ${user.isAdmin}`);
                });
            } else {
                console.log("  No users found in database.");
            }
            process.exit(1);
        }

        const user = users[0];
        console.log(`Found user: ${user.userName} (${user.email})`);
        console.log(`Current admin status: ${user.isAdmin}`);

        if (user.isAdmin) {
            console.log("User is already an admin!");
            return;
        }

        // Update user to admin
        const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update({ isAdmin: true })
            .eq("id", user.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating user:", updateError);
            process.exit(1);
        }

        console.log(`\n✓ Successfully made ${updatedUser.userName} (${updatedUser.email}) an admin!`);
        console.log(`  User ID: ${updatedUser.id}`);
        console.log(`  Admin status: ${updatedUser.isAdmin}`);

    } catch (error: any) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// Get identifier from command line arguments
const identifier = process.argv[2];

if (!identifier) {
    console.error("Error: Please provide a user identifier (Clerk User ID or email)");
    console.log("\nUsage:");
    console.log("  npx tsx scripts/make-user-admin.ts <clerkUserId>");
    console.log("  npx tsx scripts/make-user-admin.ts <email>");
    console.log("\nExample:");
    console.log("  npx tsx scripts/make-user-admin.ts user_abc123");
    console.log("  npx tsx scripts/make-user-admin.ts user@example.com");
    process.exit(1);
}

makeUserAdmin(identifier);

