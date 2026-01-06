# How to Make a User Admin

There are several ways to make a user an admin in your Supabase database:

## Method 1: Using the Script (Recommended)

1. Make sure your `.env.local` has Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

2. Run the script with the user's email or Clerk User ID:
   ```bash
   # Using email
   npm run make-admin user@example.com
   
   # Using Clerk User ID
   npm run make-admin user_abc123xyz
   ```

3. The script will:
   - Find the user
   - Show their current admin status
   - Update them to admin if they're not already

## Method 2: Using SQL in Supabase Dashboard

1. Go to your Supabase Dashboard → **SQL Editor**

2. First, list all users to find the one you want:
   ```sql
   SELECT id, "userName", email, "clerkUserId", "isAdmin" 
   FROM users 
   ORDER BY "created_at" DESC;
   ```

3. Then update the user by email:
   ```sql
   UPDATE users 
   SET "isAdmin" = true 
   WHERE email = 'your-email@example.com';
   ```

   Or by Clerk User ID:
   ```sql
   UPDATE users 
   SET "isAdmin" = true 
   WHERE "clerkUserId" = 'your-clerk-user-id';
   ```

4. Verify the update:
   ```sql
   SELECT "userName", email, "isAdmin" 
   FROM users 
   WHERE email = 'your-email@example.com';
   ```

## Method 3: Using Supabase Dashboard Table Editor

1. Go to **Table Editor** → **users** table
2. Find the user you want to make admin
3. Click on the row to edit
4. Change `isAdmin` from `false` to `true`
5. Click **Save**

## Finding Your Clerk User ID

If you need to find your Clerk User ID:

1. Sign in to your app
2. Check the browser console or network tab
3. Or check the Clerk Dashboard → Users section
4. The Clerk User ID is usually visible in the URL or user details

## Verify Admin Status

After making a user admin, they should:
- See admin menu items (All Museums, Bookings, Reports)
- Have access to `/admin/*` routes
- Be able to create/edit/delete events

## Troubleshooting

**User not found:**
- Make sure the user has signed in at least once (so they're created in the database)
- Check the email or Clerk User ID is correct
- Run the list query to see all users

**Permission denied:**
- Make sure your RLS policies allow updates
- Check that you're using the correct Supabase credentials

