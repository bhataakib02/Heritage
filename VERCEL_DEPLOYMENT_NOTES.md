# Vercel Deployment - Fresh Data Configuration ✅

## Current Status
All changes have been pushed to GitHub and are ready for Vercel deployment.

## Anti-Caching Configuration Applied

### 1. API Route Configuration (`src/app/api/events/public/route.ts`)
- ✅ `export const dynamic = 'force-dynamic'` - Forces dynamic rendering
- ✅ `export const revalidate = 0` - Disables revalidation
- ✅ `export const fetchCache = 'force-no-store'` - Forces no cache storage
- ✅ `export const runtime = 'nodejs'` - Uses Node.js runtime
- ✅ Aggressive cache control headers in response

### 2. Vercel Configuration (`vercel.json`)
- ✅ Created `vercel.json` with cache control headers
- ✅ Disabled CDN caching for `/api/events/public`
- ✅ Set `max-age=0` and `s-maxage=0` for edge cache

### 3. Client-Side Configuration (`src/app/page.tsx`)
- ✅ Multiple cache-busting query parameters
- ✅ Cache control headers in axios requests
- ✅ Refresh button for manual data refresh
- ✅ Auto-refresh on window focus

## How to Verify Fresh Data

1. **After Vercel Redeploys:**
   - Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
   - Click the "Refresh" button in the top right corner
   - Check browser console for "Fetched events: X" log

2. **Test Deletion:**
   - Delete a museum from admin panel
   - Go to landing page
   - Click "Refresh" button
   - Verify deleted museum no longer appears

3. **Check API Response:**
   - Open browser DevTools → Network tab
   - Look for `/api/events/public` request
   - Check response headers for `Cache-Control: no-store`
   - Verify response includes `timestamp` field

## Vercel Deployment Steps

1. **Automatic Deployment:**
   - Push to GitHub triggers automatic Vercel deployment
   - Wait for deployment to complete (check Vercel dashboard)

2. **Manual Redeploy (if needed):**
   - Go to Vercel Dashboard
   - Select your project
   - Click "Redeploy" button
   - Select "Use existing Build Cache" = NO (to ensure fresh build)

3. **Clear Vercel Cache (if still seeing stale data):**
   - Go to Vercel Dashboard → Settings → Data Cache
   - Clear cache if available
   - Or redeploy with "Clear Build Cache" option

## Configuration Files

- ✅ `vercel.json` - Vercel-specific cache headers
- ✅ `src/app/api/events/public/route.ts` - API route with no-cache
- ✅ `src/app/page.tsx` - Client with cache-busting
- ✅ `next.config.js` - Next.js configuration

## Expected Behavior

- ✅ API always fetches fresh data from database
- ✅ No Vercel edge/CDN caching
- ✅ No browser caching
- ✅ Manual refresh button available
- ✅ Auto-refresh on tab focus

## Troubleshooting

If museums still appear after deletion:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Deployments → View Function Logs
   - Check for any errors in `/api/events/public`

2. **Verify Database:**
   - Check Supabase dashboard
   - Confirm museums are actually deleted from `events` table

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

4. **Check API Response:**
   - Open DevTools → Network
   - Check `/api/events/public` response
   - Verify it returns empty array if no museums exist

## Last Updated
All changes committed and pushed to GitHub. Ready for Vercel deployment.

