/**
 * Supabase Adapter - Implements database operations using Supabase (PostgreSQL)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IDatabaseAdapter, IModel } from "./interface";

export class SupabaseAdapter implements IDatabaseAdapter {
    private supabase: SupabaseClient;
    private connectionString: string;
    private apiKey: string;

    constructor(connectionString: string, apiKey: string) {
        this.connectionString = connectionString;
        this.apiKey = apiKey;
        this.supabase = createClient(connectionString, apiKey);
    }

    async connect(): Promise<void> {
        try {
            // Test connection by making a simple query
            const { error } = await this.supabase.from('users').select('count').limit(1);
            if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is OK for first setup
                console.warn("Supabase connection test:", error.message);
            }
            console.log("Supabase Connected");
        } catch (error: any) {
            console.error("Supabase connection error:", error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        // Supabase client doesn't require explicit disconnection
        // But we can clear the client reference
        console.log("Supabase Disconnected");
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}

/**
 * Supabase Model Adapter - Implements IModel interface for Supabase tables
 */
export class SupabaseModelAdapter<T = any> implements IModel<T> {
    private supabase: SupabaseClient;
    private tableName: string;
    private idField: string;

    constructor(supabase: SupabaseClient, tableName: string, idField: string = 'id') {
        this.supabase = supabase;
        this.tableName = tableName;
        this.idField = idField;
    }

    async find(filter: any = {}, options?: { sort?: any; limit?: number }): Promise<T[]> {
        let query = this.supabase.from(this.tableName).select('*');
        
        // Apply filters - handle MongoDB-style queries
        if (filter && Object.keys(filter).length > 0) {
            // Handle $or queries
            if (filter.$or && Array.isArray(filter.$or)) {
                // Convert $or to Supabase's or() method
                const orConditions = filter.$or.map((condition: any) => {
                    const key = Object.keys(condition)[0];
                    const value = condition[key];
                    if (value === null || value === undefined || value === '') {
                        return `or(${key}.is.null)`;
                    }
                    return `or(${key}.eq.${value})`;
                });
                // For $or, we need to use a different approach
                // Since Supabase doesn't support $or directly, we'll fetch all and filter in JS
                // But for now, let's handle simple cases
                query = query.or(filter.$or.map((c: any) => {
                    const key = Object.keys(c)[0];
                    return `${key}.eq.${c[key]}`;
                }).join(','));
            } else {
                // Regular filters
                Object.keys(filter).forEach(key => {
                    if (key === '$or') return; // Already handled
                    
                    if (filter[key] !== undefined && filter[key] !== null) {
                        if (Array.isArray(filter[key])) {
                            query = query.in(key, filter[key]);
                        } else if (typeof filter[key] === 'object') {
                            // Handle MongoDB query operators
                            if (filter[key].$regex) {
                                // Convert regex to ilike (case-insensitive search)
                                const pattern = filter[key].$regex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                query = query.ilike(key, `%${pattern}%`);
                            } else if (filter[key].$in) {
                                query = query.in(key, filter[key].$in);
                            } else if (filter[key].$ne) {
                                query = query.neq(key, filter[key].$ne);
                            } else if (filter[key].$exists !== undefined) {
                                // Handle $exists - in Supabase, we check for null
                                if (filter[key].$exists === false) {
                                    query = query.is(key, null);
                                } else {
                                    query = query.not(key, 'is', null);
                                }
                            } else {
                                query = query.eq(key, filter[key]);
                            }
                        } else {
                            query = query.eq(key, filter[key]);
                        }
                    }
                });
            }
        }

        // Apply sorting
        if (options?.sort) {
            Object.keys(options.sort).forEach(key => {
                const order = options.sort[key] === -1 || options.sort[key] === 'desc' ? 'desc' : 'asc';
                query = query.order(key, { ascending: order === 'asc' });
            });
        } else {
            // Default sort by created_at desc
            query = query.order('created_at', { ascending: false });
        }

        // Apply limit
        if (options?.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (error) {
            // If $or query fails, try fetching all and filtering in JS
            if (error.message?.includes('$or') || filter.$or) {
                const allData = await this.supabase.from(this.tableName).select('*');
                if (allData.error) throw allData.error;
                
                let filtered = (allData.data || []) as T[];
                
                // Apply $or filter in JavaScript
                if (filter.$or) {
                    filtered = filtered.filter((item: any) => {
                        return filter.$or.some((condition: any) => {
                            const key = Object.keys(condition)[0];
                            const value = condition[key];
                            if (value === null || value === undefined || value === '') {
                                return item[key] === null || item[key] === undefined || item[key] === '';
                            }
                            return item[key] === value;
                        });
                    });
                }
                
                // Apply other filters
                Object.keys(filter).forEach(key => {
                    if (key === '$or') return;
                    if (typeof filter[key] === 'object' && filter[key].$regex) {
                        const pattern = filter[key].$regex;
                        const regex = new RegExp(pattern, filter[key].$options || 'i');
                        filtered = filtered.filter((item: any) => regex.test(item[key]));
                    } else if (filter[key] !== undefined && filter[key] !== null) {
                        filtered = filtered.filter((item: any) => item[key] === filter[key]);
                    }
                });
                
                // Apply sorting
                if (options?.sort) {
                    filtered.sort((a: any, b: any) => {
                        for (const key in options.sort) {
                            const order = options.sort[key] === -1 ? -1 : 1;
                            if (a[key] < b[key]) return -1 * order;
                            if (a[key] > b[key]) return 1 * order;
                        }
                        return 0;
                    });
                } else {
                    filtered.sort((a: any, b: any) => {
                        const aTime = new Date(a.created_at || 0).getTime();
                        const bTime = new Date(b.created_at || 0).getTime();
                        return bTime - aTime;
                    });
                }
                
                // Apply limit
                if (options?.limit) {
                    filtered = filtered.slice(0, options.limit);
                }
                
                return filtered;
            }
            throw error;
        }
        return (data || []) as T[];
    }

    async findOne(filter: any, options?: { limit?: number }): Promise<T | null> {
        const results = await this.find(filter, { ...options, limit: options?.limit || 1 });
        return results.length > 0 ? results[0] : null;
    }

    async findById(id: string): Promise<T | null> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*')
            .eq(this.idField, id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return data as T | null;
    }

    async create(data: Partial<T>): Promise<T> {
        const { data: created, error } = await this.supabase
            .from(this.tableName)
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return created as T;
    }

    async findByIdAndUpdate(id: string, data: Partial<T>, options?: any): Promise<T | null> {
        const { data: updated, error } = await this.supabase
            .from(this.tableName)
            .update(data as any)
            .eq(this.idField, id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return updated as T | null;
    }

    async findByIdAndDelete(id: string): Promise<T | null> {
        // First get the record
        const record = await this.findById(id);
        if (!record) return null;

        // Then delete it
        const { error } = await this.supabase
            .from(this.tableName)
            .delete()
            .eq(this.idField, id);

        if (error) throw error;
        return record as T;
    }

    async findOneAndUpdate(filter: any, data: Partial<T>, options?: any): Promise<T | null> {
        // Find the record first
        const existing = await this.findOne(filter);
        if (!existing) return null;

        // Get the ID from the existing record
        const id = (existing as any)[this.idField];
        if (!id) throw new Error(`Cannot find ${this.idField} in record`);

        // Update it
        return await this.findByIdAndUpdate(id, data, options);
    }

    async save(instance: any): Promise<T> {
        // For Supabase, save means upsert
        const id = instance[this.idField];
        if (id) {
            return await this.findByIdAndUpdate(id, instance) as T;
        } else {
            return await this.create(instance);
        }
    }
}

