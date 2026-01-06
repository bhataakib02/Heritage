/**
 * Database Abstraction Interface
 * This interface allows switching between different databases without changing application code
 */

export interface IDatabaseAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

export interface IModel<T = any> {
    find(filter?: any, options?: { sort?: any; limit?: number }): Promise<T[]>;
    findOne(filter: any): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    findByIdAndUpdate(id: string, data: Partial<T>, options?: any): Promise<T | null>;
    findByIdAndDelete(id: string): Promise<T | null>;
    findOneAndUpdate(filter: any, data: Partial<T>, options?: any): Promise<T | null>;
    save?(instance: any): Promise<T>;
}

export type DatabaseType = 'mongodb' | 'supabase' | 'postgresql' | 'mysql' | 'sqlite' | 'firestore';

