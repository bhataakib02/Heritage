-- Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Copy and paste the entire contents of this file

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userName" TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    "isActive" BOOLEAN DEFAULT true,
    "isAdmin" BOOLEAN DEFAULT false,
    "clerkUserId" TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer TEXT NOT NULL,
    guests JSONB NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    images JSONB NOT NULL,
    "ticketTypes" JSONB NOT NULL,
    "user" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event UUID REFERENCES events(id) ON DELETE CASCADE,
    "user" UUID REFERENCES users(id) ON DELETE CASCADE,
    "paymentId" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL,
    "ticketsCount" INTEGER NOT NULL,
    "totalAmount" NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users("clerkUserId");
CREATE INDEX IF NOT EXISTS idx_events_user ON events("user");
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings("user");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

