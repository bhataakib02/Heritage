-- Supabase Row Level Security (RLS) Policies
-- Run this SQL in your Supabase SQL Editor after creating the tables
-- For development: Allows all operations
-- For production: Adjust these policies based on your security needs

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for all users (development only)
-- In production, create more restrictive policies based on your authentication system (Clerk)
CREATE POLICY "Allow all operations" ON users
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON bookings
    FOR ALL USING (true) WITH CHECK (true);

