# Supabase Database Setup Guide

**This project now uses Supabase as the only database.** This guide will help you set up Supabase and migrate any existing MongoDB data.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under Project API keys)

## Step 2: Set Environment Variables

Create or update your `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# For Migration Only (temporary - remove after migration)
# MONGO_URL=your-mongodb-connection-string
```

## Step 3: Create Database Tables in Supabase

**Option 1: Use the SQL file (Recommended)**
1. Open the file `supabase-schema.sql` in this project
2. Copy all the SQL code from that file
3. Go to your Supabase dashboard → **SQL Editor**
4. Paste the SQL and click **Run**

**Option 2: Copy from below**
1. Go to your Supabase dashboard → **SQL Editor**
2. Copy the SQL below (without the markdown code blocks)
3. Paste and run it

The SQL file `supabase-schema.sql` contains:
- Users table creation
- Events table creation
- Bookings table creation
- Indexes for performance
- Triggers for automatic timestamp updates

## Step 4: Set Row Level Security (RLS) Policies

**Option 1: Use the SQL file (Recommended)**
1. Open the file `supabase-rls-policies.sql` in this project
2. Copy all the SQL code from that file
3. Go to your Supabase dashboard → **SQL Editor**
4. Paste the SQL and click **Run**

**Option 2: Copy from the file**
The file `supabase-rls-policies.sql` contains the RLS policies needed for development.

**Important:** For production, you should create more restrictive policies based on your authentication system (Clerk).

**Note:** For production, create more restrictive policies based on your authentication system (Clerk).

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the console for "Supabase Connected" message

3. Test creating a user or event to verify everything works

## Migration from MongoDB

If you have existing data in MongoDB:

1. Export your MongoDB data
2. Transform the data format (especially `_id` to `id`, and ObjectId references to UUIDs)
3. Import into Supabase using the Supabase dashboard or API

## Migration Complete

After migration:
1. Remove `MONGO_URL` from `.env.local` (it's no longer needed)
2. Your application now uses Supabase exclusively
3. All database operations are handled through Supabase

## Troubleshooting

### Error: "relation does not exist"
- Make sure you've created all the tables in Supabase
- Check that table names match exactly (case-sensitive)

### Error: "permission denied"
- Check your RLS policies in Supabase
- Verify your `SUPABASE_ANON_KEY` is correct

### ID Field Issues
- MongoDB uses `_id` while Supabase uses `id`
- The code automatically handles this conversion
- If you see ID-related errors, check that your queries use the correct field

## Support

The database abstraction layer allows you to switch between databases without changing your application code. All models automatically adapt to the configured database type.

