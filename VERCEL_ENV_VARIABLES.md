# Vercel Environment Variables

Copy and paste these environment variables into your Vercel project settings.

## How to Add to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below with its value
4. Make sure to select the appropriate environments (Production, Preview, Development)

---

## Required Environment Variables

### 🔐 Clerk Authentication (Required)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to find:**
- Go to https://dashboard.clerk.com
- Select your application
- Navigate to **API Keys**
- Copy the **Publishable Key** and **Secret Key**

---

### 🗄️ Supabase Database (Required)
```
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to find:**
- Go to https://supabase.com/dashboard
- Select your project
- Navigate to **Settings** → **API**
- Copy the **Project URL** and **anon/public key**

---

### 💳 Stripe Payment (Required for payments)
```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Where to find:**
- Go to https://dashboard.stripe.com
- Navigate to **Developers** → **API keys**
- Copy the **Secret key** (use test key for development, live key for production)

---

### 🔥 Firebase (Optional - for file storage/features)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSENGER_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Where to find:**
- Go to https://console.firebase.google.com
- Select your project
- Navigate to **Project Settings** → **General**
- Scroll down to **Your apps** section
- Copy the config values

---

### 🌐 Domain (Optional - for redirects)
```
NEXT_PUBLIC_DOMAIN=https://your-app.vercel.app
```

**Note:** This is optional. If not set, defaults to `https://heritage-app.vercel.app`

---

## Quick Copy Format (for Vercel Dashboard)

Copy this format and replace the values:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_DOMAIN=https://your-app.vercel.app
```

---

## Minimum Required Variables

For the app to work, you **MUST** set these at minimum:

1. ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. ✅ `CLERK_SECRET_KEY`
3. ✅ `SUPABASE_URL`
4. ✅ `SUPABASE_ANON_KEY`

Without these, the app will not function properly.

---

## Testing Your Setup

After adding variables to Vercel:

1. **Redeploy** your application (Vercel will automatically redeploy when you add environment variables)
2. Check the **Deployment Logs** to ensure no environment variable errors
3. Test authentication (sign in/sign up)
4. Test database operations (view events, create bookings)

---

## Troubleshooting

### Error: "Supabase credentials not found"
- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Check for typos in variable names
- Ensure variables are added to the correct environment (Production/Preview/Development)

### Error: "MIDDLEWARE_INVOCATION_FAILED"
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- Redeploy after adding Clerk variables

### Error: "Stripe error"
- Make sure `STRIPE_SECRET_KEY` is set if you're using payment features
- Use test keys for development, live keys for production

---

## Security Notes

⚠️ **Never commit these values to Git!**
- All environment variables should be set in Vercel dashboard only
- The `.env.local` file is for local development only
- Secret keys (CLERK_SECRET_KEY, STRIPE_SECRET_KEY) should never be exposed

