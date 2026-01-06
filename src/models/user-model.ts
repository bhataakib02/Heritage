/**
 * User Model - Supabase only
 */

import { getSupabaseClient } from "@/config/supabase";
import { IModel } from "@/lib/db/interface";
import { SupabaseModelAdapter } from "@/lib/db/supabase-adapter";

// User interface
export interface User {
    id?: string;
    userName: string;
    email: string;
    isActive: boolean;
    isAdmin: boolean;
    clerkUserId: string;
    created_at?: string;
    updated_at?: string;
}

// Create Supabase model adapter
const supabase = getSupabaseClient();
const UserModel: IModel<User> = new SupabaseModelAdapter<User>(supabase, 'users', 'id');

export default UserModel;
