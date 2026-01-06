/**
 * MongoDB Adapter - Implements database operations using Mongoose
 * This maintains backward compatibility with existing MongoDB/Mongoose code
 */

import mongoose from "mongoose";
import { IDatabaseAdapter, IModel } from "./interface";

export class MongoDBAdapter implements IDatabaseAdapter {
    private connectionString: string;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    async connect(): Promise<void> {
        try {
            if (mongoose.connection.readyState === 1) {
                console.log("MongoDB already connected");
                return;
            }
            await mongoose.connect(this.connectionString);
            console.log("MongoDB Connected");
        } catch (error: any) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("MongoDB Disconnected");
        } catch (error: any) {
            console.error("MongoDB disconnection error:", error);
            throw error;
        }
    }
}

/**
 * MongoDB Model Adapter - Wraps Mongoose models to implement IModel interface
 */
export class MongooseModelAdapter<T = any> implements IModel<T> {
    private model: mongoose.Model<any>;

    constructor(model: mongoose.Model<any>) {
        this.model = model;
    }

    async find(filter: any = {}): Promise<T[]> {
        return await this.model.find(filter);
    }

    async findOne(filter: any): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findByIdAndUpdate(id: string, data: Partial<T>, options?: any): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { ...options, new: true });
    }

    async findByIdAndDelete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async findOneAndUpdate(filter: any, data: Partial<T>, options?: any): Promise<T | null> {
        return await this.model.findOneAndUpdate(filter, data, { ...options, new: true });
    }

    async save(instance: any): Promise<T> {
        return await instance.save();
    }

    // Additional Mongoose-specific methods that might be needed
    getModel(): mongoose.Model<any> {
        return this.model;
    }
}

