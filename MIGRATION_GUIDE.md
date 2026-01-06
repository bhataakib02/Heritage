# Migration Guide: MongoDB to Supabase

This project has been migrated to use **Supabase as the only database**. All MongoDB/Mongoose code has been removed and replaced with Supabase.

## What Changed

1. **Database**: Now uses Supabase (PostgreSQL) exclusively
2. **Models**: All models (`UserModel`, `EventModel`, `BookingModel`) now use Supabase
3. **Configuration**: `dbConfig.ts` now only connects to Supabase
4. **Dependencies**: Mongoose is no longer used (but kept in package.json for migration script)

## Quick Start

1. **Set up Supabase** (if not done already):
   - Follow the `SUPABASE_SETUP.md` guide
   - Create tables in Supabase using the SQL provided

2. **Set environment variables** in `.env.local`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Migrate existing data** (if you have MongoDB data):
   ```bash
   # Add MONGO_URL temporarily to .env.local
   MONGO_URL=your-mongodb-connection-string
   
   # Run migration
   npm run migrate:supabase
   
   # Remove MONGO_URL after migration
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

## Migration Script

The migration script (`scripts/migrate-to-supabase.ts`) will:
- Connect to your MongoDB database
- Read all users, events, and bookings
- Transform and insert them into Supabase
- Preserve relationships between records
- Generate new UUIDs for Supabase (IDs will be different from MongoDB)

### Running the Migration

```bash
# Make sure you have both MONGO_URL and Supabase credentials in .env.local
npm run migrate:supabase
```

### What Gets Migrated

- ✅ Users (with all fields)
- ✅ Events (with user references updated)
- ✅ Bookings (with event and user references updated)
- ✅ Timestamps (created_at, updated_at)

### Important Notes

- **IDs will change**: MongoDB ObjectIds become Supabase UUIDs
- **Relationships are preserved**: Foreign key references are updated automatically
- **Backup first**: Always backup your data before migration
- **Verify after migration**: Check your Supabase dashboard to confirm all data

## Code Changes

### Models
- All models now use `SupabaseModelAdapter`
- ID field is `id` (UUID) instead of `_id` (ObjectId)
- All CRUD operations work the same way

### Database Connection
- `connectDB()` now only connects to Supabase
- No more MongoDB connection strings needed

### API Routes
- All routes work the same way
- No code changes needed in your API routes
- The abstraction layer handles the differences

## Troubleshooting

### "relation does not exist" error
- Make sure you've created all tables in Supabase
- Run the SQL from `SUPABASE_SETUP.md`

### "permission denied" error
- Check Row Level Security (RLS) policies in Supabase
- Verify your `SUPABASE_ANON_KEY` is correct

### Migration script fails
- Verify `MONGO_URL` is correct and accessible
- Check that Supabase tables exist
- Ensure environment variables are set correctly

## After Migration

1. ✅ Remove `MONGO_URL` from `.env.local`
2. ✅ Verify all data in Supabase dashboard
3. ✅ Test your application thoroughly
4. ✅ Optional: Remove `mongoose` from package.json if you want (kept for migration script)

## Support

If you encounter any issues:
1. Check the Supabase dashboard for errors
2. Review the migration script output
3. Verify all environment variables are set
4. Check that tables exist in Supabase

