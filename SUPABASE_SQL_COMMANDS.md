# SQL Commands for Supabase Editor

Use these SQL commands directly in your Supabase SQL Editor to manage your data.

## Step 1: Remove All Dummy Data

Copy and paste this into Supabase SQL Editor:

```sql
-- Remove all dummy bookings
DELETE FROM bookings WHERE paymentId LIKE 'pay_%' OR paymentId LIKE 'stripe_%';

-- Remove all events (CAREFUL - deletes ALL events)
DELETE FROM events;

-- Remove dummy users (keeps your real users)
DELETE FROM users 
WHERE email LIKE '%@example.com' 
   OR email = 'admin@heritage.com'
   OR "clerkUserId" LIKE 'clerk_%';

-- Verify everything is deleted
SELECT 'Users: ' || COUNT(*)::text FROM users
UNION ALL
SELECT 'Events: ' || COUNT(*)::text FROM events
UNION ALL
SELECT 'Bookings: ' || COUNT(*)::text FROM bookings;
```

## Step 2: View Your Real User

```sql
-- See all your real users
SELECT id, "userName", email, "isAdmin", "clerkUserId", created_at 
FROM users 
ORDER BY created_at DESC;
```

## Step 3: Make Yourself Admin (if needed)

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE users 
SET "isAdmin" = true 
WHERE email = 'your-email@example.com';
```

## Step 4: Add Events/Museums

**IMPORTANT:** Replace `(SELECT id FROM users WHERE "isAdmin" = true LIMIT 1)` with your actual user ID if needed.

```sql
INSERT INTO events (id, name, description, organizer, guests, location, date, time, images, "ticketTypes", "user", created_at, updated_at)
VALUES 
(
    gen_random_uuid(),
    'National Museum of History',
    'Explore the rich history of our nation through artifacts, documents, and interactive exhibits spanning centuries of cultural heritage.',
    'Ministry of Culture',
    '["Dr. Sarah Johnson", "Prof. Michael Chen"]'::jsonb,
    'New Delhi, India',
    '2024-02-15',
    '10:00 AM',
    '["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"]'::jsonb,
    '[{"name": "Adult", "price": 500, "limit": 100}, {"name": "Child", "price": 250, "limit": 50}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Art Gallery Exhibition',
    'A stunning collection of contemporary and classical art from renowned artists around the world.',
    'Heritage Arts Foundation',
    '["Artist Maria Garcia"]'::jsonb,
    'Mumbai, Maharashtra',
    '2024-02-20',
    '2:00 PM',
    '["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"]'::jsonb,
    '[{"name": "General Admission", "price": 400, "limit": 150}, {"name": "VIP", "price": 1000, "limit": 20}]'::jsonb,
    (SELECT id FROM users WHERE "isAdmin" = true LIMIT 1),
    NOW(),
    NOW()
);
```

## Step 5: Verify Events Were Added

```sql
SELECT id, name, location, date, time FROM events ORDER BY created_at DESC;
```

## Step 6: Add Bookings (Optional)

First, get your event and user IDs:

```sql
-- Get event IDs
SELECT id, name FROM events;

-- Get user IDs  
SELECT id, email, "userName" FROM users;
```

Then add bookings using those IDs:

```sql
INSERT INTO bookings (id, event, "user", "paymentId", "ticketType", "ticketsCount", "totalAmount", status, created_at, updated_at)
VALUES 
(
    gen_random_uuid(),
    (SELECT id FROM events LIMIT 1), -- Replace with actual event ID
    (SELECT id FROM users WHERE "isAdmin" = false LIMIT 1), -- Replace with actual user ID
    'stripe_pi_test_001',
    'Adult',
    2,
    1000,
    'booked',
    NOW(),
    NOW()
);
```

## Quick Reference Commands

### View All Data
```sql
-- All users
SELECT * FROM users;

-- All events
SELECT * FROM events;

-- All bookings with details
SELECT 
    b.id,
    e.name as event_name,
    u."userName" as user_name,
    b."ticketType",
    b."totalAmount",
    b.status
FROM bookings b
LEFT JOIN events e ON b.event = e.id
LEFT JOIN users u ON b."user" = u.id;
```

### Delete Specific Data
```sql
-- Delete a specific event (replace with actual ID)
DELETE FROM events WHERE id = 'your-event-id-here';

-- Delete a specific booking
DELETE FROM bookings WHERE id = 'your-booking-id-here';

-- Delete all bookings for a user
DELETE FROM bookings WHERE "user" = 'your-user-id-here';
```

### Update Data
```sql
-- Update event details
UPDATE events 
SET name = 'New Museum Name', 
    description = 'New description'
WHERE id = 'your-event-id-here';

-- Change booking status
UPDATE bookings 
SET status = 'cancelled' 
WHERE id = 'your-booking-id-here';
```

