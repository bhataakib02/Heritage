# Adding Dummy Data for Testing

This guide explains how to add dummy/test data to your Supabase database for testing purposes.

## Quick Start

Run the script to add dummy data:

```bash
npm run add-dummy-data
```

## What Gets Created

The script creates:

### 1. Users (4 users)
- **1 Admin User**
  - Email: `admin@heritage.com`
  - Username: `admin_user`
  - Role: Admin (can access admin features)

- **3 Regular Users**
  - `john.doe@example.com` (john_doe)
  - `jane.smith@example.com` (jane_smith)
  - `mike.wilson@example.com` (mike_wilson)

### 2. Events/Museums (5 events)
1. **National Museum of History** - New Delhi
2. **Art Gallery Exhibition** - Mumbai
3. **Science and Technology Museum** - Bangalore
4. **Cultural Heritage Center** - Kolkata
5. **Natural History Museum** - Chennai

Each event includes:
- Description
- Organizer information
- Guest speakers
- Location, date, and time
- Multiple ticket types with prices
- Images

### 3. Bookings (Multiple bookings)
- Bookings for different users and events
- Various ticket types and quantities
- Mix of "booked" and "cancelled" statuses
- Different booking dates (spread over last week)

## Using the Dummy Data

### Testing Admin Features
1. Sign in with: `admin@heritage.com` (or make your account admin)
2. You'll see:
   - All Museums page with 5 events
   - All Bookings page with multiple bookings
   - Reports page with booking analytics

### Testing User Features
1. Sign in with any regular user account
2. You can:
   - Browse all events on the home page
   - View event details
   - Make bookings (though these won't work with real Clerk auth)
   - View your bookings

### Testing Bookings
- The bookings are linked to dummy users
- You can see booking details, payment IDs, ticket types
- Some bookings are marked as "cancelled" for testing cancellation features

## Notes

⚠️ **Important:**
- The dummy users have fake Clerk User IDs (they won't work with real Clerk authentication)
- To test with real authentication, you'll need to:
  1. Sign in with your real account
  2. The system will create your user automatically
  3. Make yourself admin using: `npm run make-admin your-email@example.com`

## Clearing Dummy Data

If you want to remove the dummy data:

```sql
-- Run in Supabase SQL Editor
DELETE FROM bookings WHERE paymentId LIKE 'pay_%';
DELETE FROM events WHERE organizer IN ('Ministry of Culture', 'Heritage Arts Foundation', 'Science Council', 'Cultural Affairs Department', 'Wildlife Conservation Society');
DELETE FROM users WHERE email LIKE '%@example.com' OR email = 'admin@heritage.com';
```

## Customizing Dummy Data

You can edit `scripts/add-dummy-data.ts` to:
- Add more events
- Change event details
- Add more users
- Modify booking data
- Adjust dates and times

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you've run the schema SQL first (`supabase-schema.sql`)

**Error: "permission denied"**
- Check your RLS policies in Supabase
- Make sure `SUPABASE_ANON_KEY` has write permissions

**Data not showing up**
- Refresh your browser
- Check Supabase dashboard to verify data was created
- Make sure you're signed in with the correct account

