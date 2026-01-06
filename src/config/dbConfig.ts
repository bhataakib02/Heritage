/**
 * Database Configuration - Supabase only
 * Re-exported from supabase config for backward compatibility
 */

import { connectDB as connectDBSupabase, getSupabaseClient } from "@/config/supabase";

export { getSupabaseClient };
export const connectDB = connectDBSupabase;
export default connectDB;