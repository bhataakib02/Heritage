# Heritage World - Deployment Steps

## ✅ What's Been Completed

1. ✅ All terminology updated from "event" to "museum"
2. ✅ Professional museum booking form with dropdown ticket types
3. ✅ Date/time fields fixed with default values
4. ✅ Database schema updated to match implementation
5. ✅ All code changes pushed to GitHub

## 📋 What You Need to Do Now

### Step 1: Update Database Schema (REQUIRED)

**Option A: If you have existing data (RECOMMENDED)**
1. Go to Supabase Dashboard → SQL Editor
2. Open the file `migrate-events-table.sql` from your project
3. Copy ALL the SQL code
4. Paste it into Supabase SQL Editor
5. Click "Run" or press Ctrl+Enter
6. Verify no errors appear

**Option B: If starting fresh**
1. Go to Supabase Dashboard → SQL Editor
2. Open the file `supabase-schema.sql` from your project
3. Copy ALL the SQL code
4. Paste it into Supabase SQL Editor
5. Click "Run" or press Ctrl+Enter

### Step 2: Verify Database Changes

1. Go to Supabase Dashboard → Table Editor → `events` table
2. Check that these columns exist:
   - `additionalInfo` (TEXT, nullable)
   - `date` (TEXT, default: 'Open Daily')
   - `time` (TEXT, default: '9:00 AM - 6:00 PM')
3. Check that JSONB columns have defaults:
   - `guests` (default: [])
   - `images` (default: [])
   - `ticketTypes` (default: [])

### Step 3: Test Locally

1. Make sure your `.env.local` has:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Run your development server:
   ```bash
   npm run dev
   ```

3. Test the museum creation form:
   - Go to `http://localhost:3000/admin/events/new-event`
   - Fill out all steps
   - Try creating a museum
   - Verify it saves successfully

### Step 4: Deploy to Vercel

1. **Check Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure these are set:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `CLERK_SECRET_KEY`
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - All other required variables

2. **Trigger Deployment:**
   - If auto-deploy is enabled, push to GitHub will trigger deployment
   - Or manually trigger: Vercel Dashboard → Deployments → Redeploy

3. **Verify Deployment:**
   - Wait for build to complete
   - Test the live site
   - Try creating a museum on production

## 🔍 Troubleshooting

### Error: "null value in column 'date' violates not-null constraint"
- **Solution:** Run the `migrate-events-table.sql` file in Supabase
- This adds default values to the date and time columns

### Error: "column 'additionalInfo' does not exist"
- **Solution:** The migration adds this column. Make sure you ran `migrate-events-table.sql`

### Form not saving
- Check browser console for errors
- Check Vercel function logs
- Verify all environment variables are set correctly

### Images not uploading
- Verify Firebase configuration in environment variables
- Check Firebase storage permissions

## 📝 Quick Checklist

- [ ] Run `migrate-events-table.sql` in Supabase
- [ ] Verify database schema changes
- [ ] Test museum creation form locally
- [ ] Check all environment variables in Vercel
- [ ] Deploy to Vercel
- [ ] Test museum creation on production
- [ ] Verify museums appear in the list after creation

## 🎯 Next Steps After Deployment

1. Create your first museum through the admin panel
2. Test the booking flow
3. Verify all features work correctly
4. Monitor for any errors in Vercel logs

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check Vercel deployment logs
3. Check Supabase logs
4. Verify all SQL migrations ran successfully

