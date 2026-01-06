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

// Lazy initialization - only create client when model is used
let userModelInstance: IModel<User> | null = null;

function getUserModel(): IModel<User> {
    if (!userModelInstance) {
const supabase = getSupabaseClient();
        userModelInstance = new SupabaseModelAdapter<User>(supabase, 'users', 'id');
    }
    return userModelInstance;
}

const UserModel = new Proxy({} as IModel<User>, {
    get(target, prop) {
        return getUserModel()[prop as keyof IModel<User>];
    }
});

export default UserModel;
