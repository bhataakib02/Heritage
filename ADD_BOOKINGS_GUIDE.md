# Adding Dummy Bookings Guide

This guide explains how to add dummy booking data to your Supabase database for testing purposes.

## Quick Start

Run the script to add dummy bookings:

```bash
npm run add-dummy-bookings
```

## What Gets Created

The script will:

1. **Fetch existing data:**
   - All regular users (non-admin)
   - All events with their ticket types

2. **Create bookings:**
   - 2-5 bookings per user (randomly distributed)
   - Multiple bookings for popular events (first 3 events)
   - Mix of "booked" and "cancelled" statuses (75% booked, 25% cancelled)
   - Random ticket types from each event
   - Random ticket counts (1-5 tickets per booking)
   - Random dates (spread over last 30 days)
   - Unique payment IDs

## Prerequisites

Before running the script, make sure you have:

1. **Users created** - At least one regular (non-admin) user
2. **Events created** - At least one event with ticket types
3. **Environment variables set** in `.env.local`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

## Usage

### Option 1: Using npm script (Recommended)

```bash
npm run add-dummy-bookings
```

### Option 2: Direct execution

```bash
npx tsx scripts/add-dummy-bookings.ts
```

## What the Script Does

1. **Fetches existing data:**
   - Gets all regular users (excludes admin users)
   - Gets all events with their ticket types

2. **Creates bookings:**
   - For each user: Creates 2-5 random bookings across different events
   - For popular events: Adds 3-6 extra bookings per event
   - Random ticket types, counts, and amounts
   - Mix of booked and cancelled statuses
   - Dates spread over the last 30 days

3. **Inserts in batches:**
   - Inserts bookings in batches of 50 to avoid overwhelming the database
   - Shows progress for each batch

## Example Output

```
Fetching existing users and events...
Found 3 users and 5 events
Creating dummy bookings...

Creating 25 bookings...
✓ Created batch 1: 25 bookings

✓ Successfully created 25 bookings!

Summary:
  - Total bookings: 25
  - Booked: 19
  - Cancelled: 6
  - Total revenue (booked): ₹45,500

✓ Dummy bookings added successfully!
```

## Testing with the Data

After running the script, you can:

1. **View bookings in admin:**
   - Go to `/admin/bookings`
   - See all bookings with search, filter, and pagination
   - Export bookings to CSV

2. **View user bookings:**
   - Go to `/admin/users/[userid]`
   - See booking history for each user

3. **View reports:**
   - Go to `/admin/reports`
   - See revenue and booking statistics

4. **Test dashboard:**
   - Go to `/admin/dashboard`
   - See booking metrics and revenue

## Clearing Bookings

If you want to remove the dummy bookings:

```sql
-- Run in Supabase SQL Editor
DELETE FROM bookings WHERE "paymentId" LIKE 'pay_%';
```

Or delete all bookings:

```sql
DELETE FROM bookings;
```

## Customizing the Script

You can edit `scripts/add-dummy-bookings.ts` to:

- Change the number of bookings per user (currently 2-5)
- Adjust the status distribution (currently 75% booked, 25% cancelled)
- Change the date range (currently last 30 days)
- Modify ticket count range (currently 1-5)
- Add more bookings for specific events
- Change batch size (currently 50)

## Troubleshooting

**Error: "No regular users found"**
- Create users first using `npm run add-dummy-data` or manually create users

**Error: "No events found"**
- Create events first using `npm run add-dummy-data` or manually create events

**Error: "permission denied"**
- Check your RLS policies in Supabase
- Make sure `SUPABASE_ANON_KEY` has write permissions

**Error: "relation does not exist"**
- Make sure you've run the schema SQL first (`supabase-schema.sql`)

**Bookings not showing up**
- Refresh your browser
- Check Supabase dashboard to verify data was created
- Make sure you're signed in with the correct account

## Notes

- The script uses existing users and events - it doesn't create new ones
- Bookings are created with realistic payment IDs
- Dates are randomly distributed over the last 30 days
- Ticket types are randomly selected from each event's available types
- Total amounts are calculated based on ticket type price × ticket count

---

*This script is safe to run multiple times - it will add more bookings each time.*

