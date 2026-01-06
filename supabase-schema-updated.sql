-- =====================================================
-- HERITAGE WORLD - Museum Booking System
-- Complete Supabase Database Schema
-- Updated to match current implementation
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste and Run
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
-- NOTE: Keep this table structure as it exists in your database
-- Only create if it doesn't exist to avoid conflicts
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

-- =====================================================
-- 2. EVENTS TABLE (Museums)
-- =====================================================
-- Note: 'events' table stores museum information
-- Date and time are optional for museums (they're usually always open)
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer TEXT NOT NULL, -- Museum Director/Curator
    guests JSONB DEFAULT '[]'::jsonb, -- Featured Exhibitions
    location TEXT NOT NULL, -- Full museum address
    date TEXT DEFAULT 'Open Daily', -- Established date or status (optional)
    time TEXT DEFAULT '9:00 AM - 6:00 PM', -- Opening hours (optional)
    images JSONB DEFAULT '[]'::jsonb, -- Museum images array
    "ticketTypes" JSONB DEFAULT '[]'::jsonb, -- Ticket types with pricing
    "user" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "additionalInfo" TEXT, -- Additional location info (parking, transport, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    "user" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "paymentId" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL, -- e.g., "Adult", "Child", "Student", "Senior"
    "ticketsCount" INTEGER NOT NULL,
    "totalAmount" NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked', -- 'booked' or 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users("clerkUserId");
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_name ON users("userName");

CREATE INDEX IF NOT EXISTS idx_events_user ON events("user");
CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings("user");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- =====================================================
-- 5. AUTOMATIC TIMESTAMP UPDATES
-- =====================================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at updates
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. DATA VALIDATION CONSTRAINTS
-- =====================================================
-- Ensure ticket types have valid structure
ALTER TABLE events 
ADD CONSTRAINT check_ticket_types_format 
CHECK (
    "ticketTypes"::text = '[]'::text OR 
    jsonb_typeof("ticketTypes") = 'array'
);

-- Ensure images is always an array
ALTER TABLE events 
ADD CONSTRAINT check_images_format 
CHECK (
    images::text = '[]'::text OR 
    jsonb_typeof(images) = 'array'
);

-- Ensure guests is always an array
ALTER TABLE events 
ADD CONSTRAINT check_guests_format 
CHECK (
    guests::text = '[]'::text OR 
    jsonb_typeof(guests) = 'array'
);

-- Ensure booking status is valid
ALTER TABLE bookings 
ADD CONSTRAINT check_booking_status 
CHECK (status IN ('booked', 'cancelled'));

-- Ensure positive values for bookings
ALTER TABLE bookings 
ADD CONSTRAINT check_tickets_count_positive 
CHECK ("ticketsCount" > 0);

ALTER TABLE bookings 
ADD CONSTRAINT check_total_amount_positive 
CHECK ("totalAmount" >= 0);

-- =====================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE users IS 'User accounts for museum booking system';
COMMENT ON TABLE events IS 'Museums and their details (stored as events)';
COMMENT ON TABLE bookings IS 'Museum ticket bookings by users';

COMMENT ON COLUMN events.name IS 'Museum name';
COMMENT ON COLUMN events.organizer IS 'Museum Director or Chief Curator';
COMMENT ON COLUMN events.guests IS 'Featured exhibitions and collections (JSON array)';
COMMENT ON COLUMN events.date IS 'Established date or status (e.g., "Open Daily", "Established 2024")';
COMMENT ON COLUMN events.time IS 'Opening hours (e.g., "Monday-Sunday: 9:00 AM - 6:00 PM")';
COMMENT ON COLUMN events."ticketTypes" IS 'Array of ticket types: [{name, price, limit}, ...]';
COMMENT ON COLUMN events."additionalInfo" IS 'Additional location information (parking, transport, accessibility)';

COMMENT ON COLUMN bookings."ticketType" IS 'Ticket type: Adult, Child, Student, Senior, Infant, Group, VIP, Free, or Custom';
COMMENT ON COLUMN bookings.status IS 'Booking status: booked or cancelled';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
-- After running this schema, also run: supabase-rls-policies.sql
-- for Row Level Security policies
-- =====================================================

