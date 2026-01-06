/**
 * Model Wrapper - Provides a unified interface for database models
 * This allows switching databases without changing model usage in the application
 */

import { IModel } from "./interface";
import { MongooseModelAdapter } from "./mongodb-adapter";
import { SupabaseModelAdapter } from "./supabase-adapter";
import { DatabaseFactory } from "./factory";
import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";

// Get database adapter instance
let dbAdapterInstance: any = null;

function getDbAdapter() {
    if (!dbAdapterInstance) {
        const dbType = DatabaseFactory.getDatabaseType();
        let connectionString = "";
        let apiKey = "";

        if (dbType === 'supabase') {
            connectionString = process.env.SUPABASE_URL || "";
            apiKey = process.env.SUPABASE_ANON_KEY || "";
        } else {
            connectionString = process.env.MONGO_URL || process.env.DATABASE_URL || "";
        }

        dbAdapterInstance = DatabaseFactory.createAdapter(dbType, connectionString, apiKey);
    }
    return dbAdapterInstance;
}

/**
 * Creates a model adapter from a Mongoose model (for MongoDB)
 * This maintains backward compatibility while allowing future database switching
 */
export function createModelAdapter<T = any>(mongooseModel: mongoose.Model<any>): IModel<T> {
    return new MongooseModelAdapter<T>(mongooseModel);
}

/**
 * Creates a Supabase model adapter
 */
export function createSupabaseModelAdapter<T = any>(
    tableName: string,
    idField: string = 'id'
): IModel<T> {
    const dbType = DatabaseFactory.getDatabaseType();
    if (dbType !== 'supabase') {
        throw new Error("Cannot create Supabase model adapter when database type is not Supabase");
    }

    const connectionString = process.env.SUPABASE_URL || "";
    const apiKey = process.env.SUPABASE_ANON_KEY || "";
    const supabase = createClient(connectionString, apiKey);
    
    return new SupabaseModelAdapter<T>(supabase, tableName, idField);
}

/**
 * Model Factory - Creates model adapters based on database type
 * Supports MongoDB and Supabase
 */
export class ModelFactory {
    static createModel<T = any>(
        modelName: string,
        mongooseModel?: mongoose.Model<any>,
        idField: string = 'id'
    ): IModel<T> {
        const dbType = DatabaseFactory.getDatabaseType();
        
        if (dbType === 'supabase') {
            // Map model names to table names (convert to snake_case or plural)
            const tableName = this.getTableName(modelName);
            return createSupabaseModelAdapter<T>(tableName, idField);
        } else {
            // MongoDB
            if (!mongooseModel) {
                throw new Error("Mongoose model is required for MongoDB");
            }
            return createModelAdapter<T>(mongooseModel);
        }
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

