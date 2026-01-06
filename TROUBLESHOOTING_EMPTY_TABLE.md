# Troubleshooting: Empty Events Table

If you're seeing an empty table on `/admin/events`, here are the most common reasons and solutions:

## Quick Diagnosis

The table is empty because **there are no events in your Supabase database yet**. This is normal for a fresh installation!

## Solutions

### Solution 1: Add Your First Event (Recommended)

1. Click the **"Add Museum"** button on the admin events page
2. Fill out the multi-step form:
   - **Step 1**: Name, Organizer, Description, Guest Speakers
   - **Step 2**: Location, Date, Time
   - **Step 3**: Upload images
   - **Step 4**: Add ticket types with prices
3. Submit the form
4. You'll be redirected back to the events list with your new event showing

### Solution 2: Add Dummy Data for Testing

If you want to quickly populate the database with test data:

```bash
npm run add-dummy-data
```

This will create:
- 5 sample events/museums
- 4 users (1 admin, 3 regular)
- Multiple bookings

**Note**: The dummy users have fake Clerk IDs, so you'll need to sign in with your real account and make yourself admin.

### Solution 3: Check Database Connection

If you've added events but they're not showing:

#### 1. Verify Environment Variables

Check your `.env.local` file has:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

#### 2. Check Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → **events**
3. Check if events exist in the database
4. If events exist but don't show in the app, check RLS policies

#### 3. Verify RLS Policies

Run this SQL in Supabase SQL Editor to ensure RLS allows reading:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'events';

-- If RLS is blocking, create a policy (for development)
CREATE POLICY "Allow all operations" ON events
    FOR ALL USING (true) WITH CHECK (true);
```

Or run the full RLS setup:

```sql
-- From supabase-rls-policies.sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON events
    FOR ALL USING (true) WITH CHECK (true);
```

#### 4. Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Look for any error messages
4. Common errors:
   - `Supabase credentials not found` → Check `.env.local`
   - `permission denied` → Check RLS policies
   - `relation does not exist` → Run `supabase-schema.sql`

#### 5. Check Server Logs

Look at your terminal where the Next.js server is running for:
- Connection errors
- Supabase errors
- Any warnings about missing data

### Solution 4: Verify Database Schema

Make sure your Supabase database has the `events` table:

1. Go to Supabase Dashboard → **Table Editor**
2. You should see an `events` table
3. If it doesn't exist, run `supabase-schema.sql` in SQL Editor

### Solution 5: Check Network Tab

1. Open browser Developer Tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for requests to Supabase
5. Check if they return data or errors

## Common Issues

### Issue: "Supabase credentials not found"

**Solution**: 
- Create `.env.local` file in project root
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Restart your Next.js server

### Issue: "permission denied" or "new row violates row-level security policy"

**Solution**:
- Run `supabase-rls-policies.sql` in Supabase SQL Editor
- Or create a policy that allows all operations (development only)

### Issue: Events exist in database but don't show

**Possible causes**:
1. RLS policies blocking access
2. Wrong environment variables (pointing to different project)
3. Cache issues - try hard refresh (Ctrl+F5)

### Issue: "relation 'events' does not exist"

**Solution**:
- Run `supabase-schema.sql` in Supabase SQL Editor
- This creates all necessary tables

## Step-by-Step Verification

Follow these steps to verify everything is set up correctly:

1. ✅ **Check `.env.local` exists** with Supabase credentials
2. ✅ **Restart Next.js server** after adding env variables
3. ✅ **Verify Supabase connection** - check server logs for "Supabase Connected"
4. ✅ **Check database schema** - events table exists in Supabase
5. ✅ **Check RLS policies** - policies allow reading events
6. ✅ **Add a test event** - use "Add Museum" button
7. ✅ **Check Supabase dashboard** - verify event was created
8. ✅ **Refresh browser** - events should appear

## Still Not Working?

If none of the above solutions work:

1. **Check the updated events page** - it now shows helpful error messages
2. **Look at browser console** for specific error messages
3. **Check server terminal** for backend errors
4. **Verify you're logged in** as an admin user
5. **Try creating an event** - if creation fails, that's the real issue

## Quick Test

Run this in Supabase SQL Editor to manually check if events exist:

```sql
SELECT COUNT(*) FROM events;
```

If this returns 0, you just need to add events. If it returns a number > 0 but the app shows empty, there's a connection/RLS issue.

---

**Remember**: An empty table is normal if you haven't created any events yet! Just click "Add Museum" to get started.

