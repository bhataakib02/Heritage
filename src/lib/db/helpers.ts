/**
 * Database Helper Functions
 * Utilities for working with different database types
 */

import { DatabaseFactory } from "./factory";

/**
 * Normalizes ID field - converts _id (MongoDB) to id (Supabase) or vice versa
 */
export function normalizeId(record: any): any {
    if (!record) return record;
    
    const dbType = DatabaseFactory.getDatabaseType();
    
    if (dbType === 'supabase') {
        // Supabase uses 'id', ensure it exists
        if (record._id && !record.id) {
            record.id = record._id.toString();
            delete record._id;
        }
    } else {
        // MongoDB uses '_id', ensure it exists
        if (record.id && !record._id) {
            record._id = record.id;
            delete record.id;
        }
    }
    
    return record;
}

/**
 * Gets the ID field name based on database type
 */
export function getIdFieldName(): string {
    const dbType = DatabaseFactory.getDatabaseType();
    return dbType === 'supabase' ? 'id' : '_id';
}

/**
 * Extracts ID from a record (handles both _id and id)
 */
export function extractId(record: any): string | null {
    if (!record) return null;
    return record._id?.toString() || record.id?.toString() || null;
}

