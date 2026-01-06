/**
 * Database Factory - Creates appropriate database adapter based on configuration
 * This allows easy switching between databases via environment variables
 */

import { DatabaseType, IDatabaseAdapter } from "./interface";
import { MongoDBAdapter } from "./mongodb-adapter";
import { SupabaseAdapter } from "./supabase-adapter";

export class DatabaseFactory {
    static createAdapter(dbType: DatabaseType, connectionString: string, apiKey?: string): IDatabaseAdapter {
        switch (dbType) {
            case 'mongodb':
                return new MongoDBAdapter(connectionString);
            
            case 'supabase':
                if (!apiKey) {
                    throw new Error("Supabase API key (SUPABASE_ANON_KEY) is required");
                }
                return new SupabaseAdapter(connectionString, apiKey);
            
            // Add more database adapters here as needed
            // case 'postgresql':
            //     return new PostgreSQLAdapter(connectionString);
            // case 'mysql':
            //     return new MySQLAdapter(connectionString);
            // case 'firestore':
            //     return new FirestoreAdapter(connectionString);
            
            default:
                // Default to Supabase
                console.warn(`Database type "${dbType}" not implemented, defaulting to Supabase`);
                if (!apiKey) {
                    throw new Error("Supabase API key (SUPABASE_ANON_KEY) is required");
                }
                return new SupabaseAdapter(connectionString, apiKey);
        }
    }

    static getDatabaseType(): DatabaseType {
        const dbType = (process.env.DATABASE_TYPE || 'supabase').toLowerCase() as DatabaseType;
        return dbType;
    }
}

