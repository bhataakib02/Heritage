/**
 * Database Factory - Creates appropriate database adapter based on configuration
 * This allows easy switching between databases via environment variables
 */

import { DatabaseType, IDatabaseAdapter } from "./interface";
import { SupabaseAdapter } from "./supabase-adapter";

export class DatabaseFactory {
    static createAdapter(dbType: DatabaseType, connectionString: string, apiKey?: string): IDatabaseAdapter {
        // Only Supabase is supported now
        if (!apiKey) {
            throw new Error("Supabase API key (SUPABASE_ANON_KEY) is required");
        }
        return new SupabaseAdapter(connectionString, apiKey);
    }

    static getDatabaseType(): DatabaseType {
        const dbType = (process.env.DATABASE_TYPE || 'supabase').toLowerCase() as DatabaseType;
        return dbType;
    }
}

