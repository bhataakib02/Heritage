-- =====================================================
-- HERITAGE WORLD - Events Table Migration
-- Update events table to match museum booking system
-- KEEPS USERS TABLE UNCHANGED
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste and Run
-- =====================================================

-- =====================================================
-- STEP 1: Update events table structure
-- =====================================================
-- Add additionalInfo column if it doesn't exist
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS "additionalInfo" TEXT;

-- Update date column to have default value (if not already set)
-- First, set default for existing NULL values
UPDATE events 
SET date = 'Open Daily' 
WHERE date IS NULL OR date = '';

UPDATE events 
SET time = '9:00 AM - 6:00 PM' 
WHERE time IS NULL OR time = '';

-- Now alter the columns to have defaults
ALTER TABLE events 
ALTER COLUMN date SET DEFAULT 'Open Daily';

ALTER TABLE events 
ALTER COLUMN time SET DEFAULT '9:00 AM - 6:00 PM';

-- Update JSONB columns to have defaults
ALTER TABLE events 
ALTER COLUMN guests SET DEFAULT '[]'::jsonb;

ALTER TABLE events 
ALTER COLUMN images SET DEFAULT '[]'::jsonb;

ALTER TABLE events 
ALTER COLUMN "ticketTypes" SET DEFAULT '[]'::jsonb;

-- Update existing NULL values to empty arrays
UPDATE events 
SET guests = '[]'::jsonb 
WHERE guests IS NULL;

UPDATE events 
SET images = '[]'::jsonb 
WHERE images IS NULL;

UPDATE events 
SET "ticketTypes" = '[]'::jsonb 
WHERE "ticketTypes" IS NULL;

-- =====================================================
-- STEP 2: Add additional indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- =====================================================
-- STEP 3: Add validation constraints (optional)
-- =====================================================
-- Ensure ticket types have valid structure
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_ticket_types_format'
    ) THEN
        ALTER TABLE events 
        ADD CONSTRAINT check_ticket_types_format 
        CHECK (
            "ticketTypes"::text = '[]'::text OR 
            jsonb_typeof("ticketTypes") = 'array'
        );
    END IF;
END $$;

-- Ensure images is always an array
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_images_format'
    ) THEN
        ALTER TABLE events 
        ADD CONSTRAINT check_images_format 
        CHECK (
            images::text = '[]'::text OR 
            jsonb_typeof(images) = 'array'
        );
    END IF;
END $$;

-- Ensure guests is always an array
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_guests_format'
    ) THEN
        ALTER TABLE events 
        ADD CONSTRAINT check_guests_format 
        CHECK (
            guests::text = '[]'::text OR 
            jsonb_typeof(guests) = 'array'
        );
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the migration:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'events' 
-- ORDER BY ordinal_position;

-- SELECT * FROM events LIMIT 1;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
-- Your users table remains completely unchanged
-- Only the events table has been updated
-- =====================================================

