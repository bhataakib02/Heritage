-- Remove All Dummy Data
-- Run this in Supabase SQL Editor to clean up dummy data

-- Delete all bookings (you can also keep real ones by filtering)
DELETE FROM bookings WHERE paymentId LIKE 'pay_%' OR paymentId LIKE 'stripe_%';

-- Delete all events (be careful - this deletes ALL events)
-- If you want to keep some, add a WHERE clause
DELETE FROM events;

-- Delete dummy users (keeps your real users)
DELETE FROM users 
WHERE email LIKE '%@example.com' 
   OR email = 'admin@heritage.com'
   OR "clerkUserId" LIKE 'clerk_%';

-- Verify deletion
SELECT COUNT(*) as remaining_users FROM users;
SELECT COUNT(*) as remaining_events FROM events;
SELECT COUNT(*) as remaining_bookings FROM bookings;

