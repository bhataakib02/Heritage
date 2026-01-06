-- SQL Script to Make a User Admin in Supabase
-- Run this in your Supabase SQL Editor
-- 
-- Option 1: Update by email
UPDATE users 
SET "isAdmin" = true 
WHERE email = 'your-email@example.com';

-- Option 2: Update by Clerk User ID
UPDATE users 
SET "isAdmin" = true 
WHERE "clerkUserId" = 'your-clerk-user-id';

-- Option 3: Update by username
UPDATE users 
SET "isAdmin" = true 
WHERE "userName" = 'your-username';

-- Option 4: List all users to find the one you want
SELECT id, "userName", email, "clerkUserId", "isAdmin" 
FROM users 
ORDER BY "created_at" DESC;

-- Option 5: Make the first user (oldest) an admin
UPDATE users 
SET "isAdmin" = true 
WHERE id = (SELECT id FROM users ORDER BY "created_at" ASC LIMIT 1);

