-- SQL Commands to Add Data via Supabase Editor
-- Copy and paste these commands into Supabase SQL Editor
-- Run them one section at a time

-- ============================================
-- STEP 1: Add Users
-- ============================================
-- First, get your real user ID from the users table
-- Then you can add more users if needed

-- View existing users
SELECT id, "userName", email, "isAdmin", "clerkUserId" FROM users;

-- Make your existing user an admin (replace 'your-email@example.com' with your email)
UPDATE users 
SET "isAdmin" = true 
WHERE email = 'your-email@example.com';

-- ============================================
-- STEP 2: Add Events/Museums
-- ============================================
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from the users table above

INSERT INTO events (id, name, description, organizer, guests, location, date, time, images, "ticketTypes", "user", created_at, updated_at)
VALUES 
(
    gen_random_uuid(),
    'National Museum of History',
    'Explore the rich history of our nation through artifacts, documents, and interactive exhibits spanning centuries of cultural heritage.',
    'Ministry of Culture',
    '["Dr. Sarah Johnson", "Prof. Michael Chen", "Ambassador James Wilson"]'::jsonb,
    'New Delhi, India',
    '2024-02-15',
    '10:00 AM',
    '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]'::jsonb,
    '[{"name": "Adult", "price": 500, "limit": 100}, {"name": "Child", "price": 250, "limit": 50}, {"name": "Senior", "price": 300, "limit": 30}, {"name": "Student", "price": 200, "limit": 40}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1), -- Uses first admin user
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Art Gallery Exhibition',
    'A stunning collection of contemporary and classical art from renowned artists around the world. Features paintings, sculptures, and digital art installations.',
    'Heritage Arts Foundation',
    '["Artist Maria Garcia", "Curator David Lee"]'::jsonb,
    'Mumbai, Maharashtra',
    '2024-02-20',
    '2:00 PM',
    '["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800", "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800"]'::jsonb,
    '[{"name": "General Admission", "price": 400, "limit": 150}, {"name": "VIP", "price": 1000, "limit": 20}, {"name": "Group (5+)", "price": 300, "limit": 50}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Science and Technology Museum',
    'Interactive exhibits showcasing the latest innovations in science and technology. Perfect for families and science enthusiasts.',
    'Science Council',
    '["Dr. Emily Brown", "Prof. Robert Taylor"]'::jsonb,
    'Bangalore, Karnataka',
    '2024-02-25',
    '11:00 AM',
    '["https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800"]'::jsonb,
    '[{"name": "Adult", "price": 350, "limit": 200}, {"name": "Child (under 12)", "price": 150, "limit": 100}, {"name": "Family Pack (2+2)", "price": 800, "limit": 30}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Cultural Heritage Center',
    'Experience the diverse cultural traditions, music, dance, and crafts from different regions. Live performances and workshops available.',
    'Cultural Affairs Department',
    '["Master Performer Rajesh Kumar", "Dancer Priya Sharma"]'::jsonb,
    'Kolkata, West Bengal',
    '2024-03-01',
    '3:00 PM',
    '["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800", "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800"]'::jsonb,
    '[{"name": "Standard", "price": 300, "limit": 120}, {"name": "Premium", "price": 600, "limit": 40}, {"name": "Workshop Access", "price": 500, "limit": 25}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Natural History Museum',
    'Discover the wonders of nature with exhibits on dinosaurs, wildlife, geology, and ecosystems. Educational and entertaining for all ages.',
    'Wildlife Conservation Society',
    '["Dr. Lisa Anderson", "Biologist Mark Thompson"]'::jsonb,
    'Chennai, Tamil Nadu',
    '2024-03-05',
    '9:00 AM',
    '["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800"]'::jsonb,
    '[{"name": "Adult", "price": 400, "limit": 180}, {"name": "Child", "price": 200, "limit": 90}, {"name": "Senior", "price": 250, "limit": 50}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1),
    NOW(),
    NOW()
);

-- Verify events were added
SELECT id, name, location, date FROM events ORDER BY created_at DESC;

-- ============================================
-- STEP 3: Add Bookings (Optional)
-- ============================================
-- Only add bookings if you have events and users
-- Replace event IDs and user IDs with actual IDs from your database

-- First, get event and user IDs
SELECT id, name FROM events;
SELECT id, email, "userName" FROM users;

-- Then add bookings (replace the UUIDs with actual IDs from above)
INSERT INTO bookings (id, event, "user", "paymentId", "ticketType", "ticketsCount", "totalAmount", status, created_at, updated_at)
VALUES 
(
    gen_random_uuid(),
    (SELECT id FROM events LIMIT 1 OFFSET 0), -- First event
    (SELECT id FROM users WHERE "isAdmin" = false LIMIT 1), -- First non-admin user
    'stripe_pi_test_001',
    'Adult',
    2,
    1000,
    'booked',
    NOW() - INTERVAL '2 days',
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM events LIMIT 1 OFFSET 1), -- Second event
    (SELECT id FROM users WHERE "isAdmin" = false LIMIT 1),
    'stripe_pi_test_002',
    'VIP',
    1,
    1000,
    'booked',
    NOW() - INTERVAL '1 day',
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM events LIMIT 1 OFFSET 0), -- First event
    (SELECT id FROM users WHERE "isAdmin" = false LIMIT 1),
    'stripe_pi_test_003',
    'Child',
    3,
    750,
    'booked',
    NOW() - INTERVAL '3 hours',
    NOW()
);

-- Verify bookings were added
SELECT 
    b.id,
    e.name as event_name,
    u."userName" as user_name,
    b."ticketType",
    b."ticketsCount",
    b."totalAmount",
    b.status
FROM bookings b
LEFT JOIN events e ON b.event = e.id
LEFT JOIN users u ON b."user" = u.id
ORDER BY b.created_at DESC;

