/**
 * Supabase Configuration
 * Single database connection for the application
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/**
 * Initialize and return Supabase client
 */
export function getSupabaseClient(): SupabaseClient {
    if (!supabaseClient) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error(
                "Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
            );
        }

        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }

    return supabaseClient;
}

/**
 * Connect to Supabase (for compatibility with existing code)
 */
export const connectDB = async () => {
    try {
        const client = getSupabaseClient();
        // Test connection
        const { error } = await client.from('users').select('count').limit(1);
        if (error && error.code !== 'PGRST116') {
            console.warn("Supabase connection test:", error.message);
        }
        console.log("Supabase Connected");
    } catch (error: any) {
        console.error("Supabase connection error:", error);
        throw error;
    }
};

export default getSupabaseClient;

