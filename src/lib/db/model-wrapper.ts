/**
 * Model Wrapper - Provides a unified interface for database models
 * This allows switching databases without changing model usage in the application
 */

import { IModel } from "./interface";
import { SupabaseModelAdapter } from "./supabase-adapter";
import { DatabaseFactory } from "./factory";
import { createClient } from "@supabase/supabase-js";

// Get database adapter instance
let dbAdapterInstance: any = null;

function getDbAdapter() {
    if (!dbAdapterInstance) {
        const dbType = DatabaseFactory.getDatabaseType();
        let connectionString = "";
        let apiKey = "";

        // Only Supabase is supported now
        connectionString = process.env.SUPABASE_URL || "";
        apiKey = process.env.SUPABASE_ANON_KEY || "";

        dbAdapterInstance = DatabaseFactory.createAdapter(dbType, connectionString, apiKey);
    }
    return dbAdapterInstance;
}

/**
 * Creates a Supabase model adapter
 */
export function createSupabaseModelAdapter<T = any>(
    tableName: string,
    idField: string = 'id'
): IModel<T> {
    // Only Supabase is supported now
    const connectionString = process.env.SUPABASE_URL || "";
    const apiKey = process.env.SUPABASE_ANON_KEY || "";
    const supabase = createClient(connectionString, apiKey);
    
    return new SupabaseModelAdapter<T>(supabase, tableName, idField);
}

/**
 * Model Factory - Creates model adapters for Supabase
 */
export class ModelFactory {
    static createModel<T = any>(
        modelName: string,
        idField: string = 'id'
    ): IModel<T> {
        // Only Supabase is supported now
        // Map model names to table names (convert to snake_case or plural)
        const tableName = this.getTableName(modelName);
        return createSupabaseModelAdapter<T>(tableName, idField);
    }

    private static getTableName(modelName: string): string {
        // Convert model names to table names
        // e.g., "users" -> "users", "events" -> "events", "bookings" -> "bookings"
        const tableMap: Record<string, string> = {
            'users': 'users',
            'events': 'events',
            'bookings': 'bookings',
        };
        
        return tableMap[modelName.toLowerCase()] || modelName.toLowerCase();
    }
}

