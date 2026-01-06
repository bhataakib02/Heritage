# Complete Admin Features Guide

This document lists all admin features available in the Heritage App.

## Admin Navigation Menu

When logged in as admin, you'll see these menu items in the Profile dropdown:

1. **Home** - Main page with all events
2. **All Museums** - Manage all museums/events
3. **All Bookings** - View all bookings from all users
4. **All Users** - View and manage all users
5. **Reports** - View detailed reports and analytics

---

## 1. All Museums (`/admin/events`)

### Features:
- ✅ View all museums/events in a table
- ✅ Add new museum (click "Add Museum" button)
- ✅ Edit museum (click pencil icon)
- ✅ Delete museum (click delete icon)
- ✅ See: Name, Organizer, Date, Time, Location
- ✅ **Sorting**: Events are sorted by creation date (newest first)
- ✅ **Empty State**: Shows empty table when no events exist
- ✅ **Loading States**: Delete button shows loading spinner during deletion

### Actions:
- **Add Museum**: `/admin/events/new-event`
- **Edit Museum**: `/admin/events/edit-event/[eventid]`
- **Delete Museum**: Click delete icon in table (with loading indicator)

### Event Creation/Editing Details:

#### Multi-Step Form Process:
The event creation/editing form uses a 4-step wizard:

1. **General** → Basic information
2. **Location & Date** → Venue and timing details
3. **Media** → Image uploads
4. **Tickets** → Ticket types and pricing

#### Step 1: General Information
**Fields:**
- **Museum Name** (Required) - Text input
- **Organizer** (Required) - Text input
- **Description** (Required) - Textarea
- **Guest Speakers** - Can add multiple guests:
  - Enter guest names (comma-separated for multiple)
  - Click "Add" button to add guests
  - Guests appear as removable chips
  - Can remove individual guests by clicking the X on each chip

**Validation:**
- Name, Organizer, and Description are required before proceeding to next step
- "Next" button is disabled until all required fields are filled

#### Step 2: Location & Date
**Fields:**
- Location
- Date
- Time

#### Step 3: Media
**Features:**
- Upload multiple images
- When editing: Existing images are preserved
- Can add new images in addition to existing ones
- Images are uploaded to Firebase and URLs are stored

#### Step 4: Tickets
**Features:**
- Add multiple ticket types
- Each ticket type has:
  - Name
  - Price
  - Quantity available (optional)

#### Form Behavior:
- **Auto-redirect**: After creating/editing, automatically redirects to `/admin/events`
- **Toast Notifications**: 
  - Success: "Museum created successfully" or "Event updated successfully"
  - Error: Displays error message if operation fails
- **Form Reset**: Form clears after successful submission

---

## 2. All Bookings (`/admin/bookings`)

### Features:
- ✅ View ALL bookings from ALL users
- ✅ See complete booking details:
  - Event name, location, date, time
  - User name and email (clickable link to user details)
  - Booking ID
  - Ticket type and count
  - Total amount paid
  - Payment ID
  - Booking date and time
  - Status (booked/cancelled)
- ✅ Cancel bookings (for non-cancelled bookings)
- ✅ Click user name to view their full profile

### Booking Display Details:

#### Status Badges:
- **Booked**: Green badge (`bg-green-100 text-green-800`)
- **Cancelled**: Red badge (`bg-red-100 text-red-800`)
- Status is displayed with color-coded visual indicators

#### Date Formatting:
- Booking timestamps: `DD/MM/YYYY hh:mm A` format
- Example: "06/01/2026 08:42 AM"

#### Empty States:
- Shows "No bookings found." message when no bookings exist
- Centered, gray text display

#### Error Handling:
- Displays error message: "Error loading bookings: [error message]"
- Red text color for error visibility
- Page title still displays even on error

#### What you can see:
- Which user booked which event
- How many tickets they bought
- How much they paid
- Payment transaction ID
- When they booked
- Current booking status

---

## 3. All Users (`/admin/users`)

### Features:
- ✅ View all users in a table
- ✅ See user statistics:
  - User name and email
  - Role (Admin/User) - with color-coded badges
  - Total number of bookings
  - Total amount spent
  - Join date
- ✅ Click "View Details" to see complete user profile
- ✅ **Sorting**: Users are sorted by creation date (newest first)
- ✅ **Empty State**: Shows "No users found." when no users exist

### Role Badges:
- **Admin**: Blue badge (`bg-blue-100 text-blue-800`)
- **User**: Gray badge (`bg-gray-100 text-gray-800`)

### Date Formatting:
- Join dates: `DD/MM/YYYY` format
- Example: "06/01/2026"

### User Details Page (`/admin/users/[userid]`)

#### Navigation:
- **Back Navigation**: "← Back to Users" link at top of page
- Clickable link that returns to users list

#### User Information Section:
- **User Name**: Full display name
- **Email**: User's email address
- **Role**: Admin/User badge (same color coding as main table)
- **Status**: Active/Inactive indicator
- **Joined Date**: `DD/MM/YYYY hh:mm A` format
- **Clerk User ID**: Full Clerk authentication ID displayed

#### Booking Statistics Section:
Displays comprehensive statistics:
- **Total Bookings**: Count of all bookings
- **Active Bookings**: Count of bookings with "booked" status
- **Cancelled**: Count of bookings with "cancelled" status
- **Total Tickets**: Sum of all tickets purchased
- **Total Spent**: Total amount spent (₹ format)

#### Booking History Section:
Complete booking history with:
- **Event Name**: Name of the museum/event
- **Event Location**: Venue location
- **Event Date**: Date of the event
- **Booking ID**: Truncated ID (first 8 characters + "...")
- **Ticket Type**: Type of ticket purchased
- **Tickets**: Number of tickets
- **Amount**: Total amount paid (₹ format)
- **Payment ID**: Full payment transaction ID
- **Booked On**: Timestamp in `DD/MM/YYYY hh:mm A` format
- **Status**: Color-coded badge (green for booked, red for cancelled)

#### Empty States:
- **No Bookings**: Shows "No bookings found for this user." when user has no bookings
- Centered, gray text display

#### Error Handling:
- **User Not Found**: Shows "User not found." with red text
- Includes back link to users list
- **Error Loading**: Shows "Error loading user details: [error message]"
- Includes back link for navigation

---

## 4. Reports (`/admin/reports`)

### Main Reports Page:
- ✅ List of all events/museums
- ✅ Click "View Report" to see detailed analytics
- ✅ **Empty State**: Handles cases when no events exist

### Event Report Page (`/admin/reports/[eventid]`)

#### Event Information Header:
- Event name with "Reports" suffix
- Location with map pin icon
- Date and time with calendar icon
- Dark gray background with white text

#### Revenue by Ticket Type:
- **Card Display**: Each ticket type shown in separate card
- **Metrics per Type**:
  - Tickets Sold: Count of tickets sold for that type
  - Revenue: Amount generated from that ticket type
- **Grid Layout**: Responsive grid (1 column on mobile, 4 columns on desktop)

#### Total Revenue Display:
- Large, prominent display
- Shows total revenue across all ticket types
- **Currency**: ₹ (Indian Rupees)

#### User Bookings Details Table:
Complete table showing:
- **User Name**: Name of the user who booked
- **Email**: User's email address
- **Ticket Type**: Type of ticket purchased
- **Tickets**: Number of tickets
- **Amount Paid**: Total amount (₹ format)
- **Payment ID**: Full payment transaction ID
- **Booked On**: Date in standard date format

#### Summary Statistics Cards:
Three summary cards displayed:
1. **Total Bookings**: Count of all bookings for the event
2. **Total Tickets Sold**: Sum of all tickets sold
3. **Total Revenue**: Total revenue generated (₹ format)

#### Important Notes:
- ⚠️ **Currency Inconsistency Bug**: The revenue by ticket type cards show `$` (dollar sign) but should show `₹` (rupees) to match the rest of the application
- **Filtering**: Reports only show bookings with "booked" status (cancelled bookings are excluded from revenue calculations)
- **Empty States**: Shows "No bookings found for this event." when no bookings exist

---

## Complete Admin Capabilities

### User Management
- ✅ View all users (sorted by newest first)
- ✅ See user details and booking history
- ✅ View user statistics (bookings, spending, tickets)
- ✅ See which events each user booked
- ✅ View user status (Active/Inactive)
- ✅ See Clerk User ID for each user
- ✅ Navigate between users list and user details

### Museum/Event Management
- ✅ Create new museums/events (multi-step form)
- ✅ Edit existing museums/events (preserve existing images)
- ✅ Delete museums/events (with loading indicator)
- ✅ View all museums in organized table
- ✅ Manage event details:
  - Basic information (name, organizer, description)
  - Guest speakers
  - Location and date/time
  - Multiple images
  - Multiple ticket types with pricing

### Booking Management
- ✅ View all bookings from all users
- ✅ See complete booking details
- ✅ Cancel bookings (for non-cancelled bookings)
- ✅ Track payment information
- ✅ See booking history per user
- ✅ View color-coded status badges
- ✅ Filter bookings by status (in reports)

### Reports & Analytics
- ✅ Event-wise revenue reports
- ✅ Ticket type analytics
- ✅ User booking details per event
- ✅ Total revenue tracking
- ✅ Tickets sold statistics
- ✅ Summary statistics cards
- ✅ Revenue breakdown by ticket type

---

## User Experience Features

### Loading States
- **Delete Operations**: Loading spinner appears on delete button during deletion
- **Form Submissions**: Loading state prevents multiple submissions
- **Button States**: Disabled states for buttons during operations

### Toast Notifications
Success messages:
- "Museum created successfully"
- "Event updated successfully"
- "Event Deleted Successfully"

Error messages:
- Displays specific error messages from API
- Red toast notifications for errors
- Green toast notifications for success

### Auto-Redirects
- After creating event: Redirects to `/admin/events`
- After editing event: Redirects to `/admin/events`
- After deleting event: Page refreshes to show updated list

### Navigation
- **Breadcrumbs**: User details page has back navigation
- **Menu Access**: All admin features accessible from Profile dropdown
- **Direct Links**: User names in bookings link to user details

### Empty States
All pages handle empty data gracefully:
- **Events**: Empty table when no events
- **Bookings**: "No bookings found." message
- **Users**: "No users found." message
- **User Bookings**: "No bookings found for this user." message
- **Event Reports**: "No bookings found for this event." message

### Error Handling
- **API Errors**: Displays error messages in red text
- **Not Found**: Shows "not found" messages with navigation options
- **Loading Errors**: Error messages displayed with context
- **Form Validation**: Required fields prevent progression

---

## Date Formatting

The application uses consistent date formatting:

- **Join Dates**: `DD/MM/YYYY` format
  - Example: "06/01/2026"
- **Booking Timestamps**: `DD/MM/YYYY hh:mm A` format
  - Example: "06/01/2026 08:42 AM"
- **Event Dates**: Standard date format (as stored in database)

---

## How to Access

1. **Make yourself admin** (if not already):
   ```bash
   npm run make-admin your-email@example.com
   ```
   
   See `MAKE_ADMIN_GUIDE.md` for alternative methods.

2. **Sign in** to the application

3. **Click "Profile"** dropdown in the top right

4. **Select any admin menu item** to access that feature

---

## Data Flow

- **Users** → Create account via Clerk → Stored in Supabase
- **Events** → Created by admin → Stored in Supabase
- **Bookings** → Created by users → Linked to events and users → Stored in Supabase
- **Reports** → Calculated from bookings data → Shows analytics

All data is stored in Supabase and can be managed through the admin interface!

---

## Permissions & Access Control

### Admin-Only Features:
- Access to `/admin/*` routes
- Create, edit, delete events
- View all bookings from all users
- View all users and their details
- Access reports and analytics
- Cancel any user's booking

### Non-Admin Users Cannot:
- Access admin routes (will be blocked/redirected)
- Create, edit, or delete events
- View other users' bookings
- View user management pages
- Access reports

### Role-Based UI:
- Admin users see 5 menu items in Profile dropdown
- Regular users see only: Home and Bookings

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Empty Tables/Lists
**Issue**: Tables show no data even though data exists in database.

**Solutions**:
- Check Supabase connection in `.env.local`
- Verify RLS (Row Level Security) policies allow admin access
- Check browser console for errors
- Verify user has `isAdmin: true` in database

#### 2. Cannot Delete Event
**Issue**: Delete button doesn't work or shows error.

**Solutions**:
- Check network tab for API errors
- Verify event has no active bookings (may need to cancel bookings first)
- Check Supabase permissions
- Ensure admin status is active

#### 3. Images Not Uploading
**Issue**: Images fail to upload when creating/editing events.

**Solutions**:
- Check Firebase configuration in `.env.local`
- Verify Firebase storage rules allow uploads
- Check image file size (may be too large)
- Verify image format is supported

#### 4. User Details Not Loading
**Issue**: User details page shows "User not found" or error.

**Solutions**:
- Verify user ID in URL is correct
- Check if user exists in Supabase users table
- Verify database connection
- Check browser console for specific errors

#### 5. Reports Show Wrong Currency
**Issue**: Reports show `$` instead of `₹`.

**Solution**:
- This is a known bug in the codebase
- Revenue by ticket type cards display `$` but should show `₹`
- Total revenue correctly shows `₹`
- Can be fixed by updating the report component

#### 6. Bookings Not Appearing
**Issue**: Bookings don't show up in admin bookings page.

**Solutions**:
- Check if bookings exist in database
- Verify booking status (cancelled bookings still show in admin view)
- Check Supabase RLS policies
- Verify user has admin access

#### 7. Form Validation Not Working
**Issue**: Can proceed to next step without required fields.

**Solutions**:
- Clear browser cache
- Check browser console for JavaScript errors
- Verify form component is loading correctly
- Try refreshing the page

#### 8. Toast Notifications Not Showing
**Issue**: Success/error messages don't appear.

**Solutions**:
- Check if `react-hot-toast` is properly installed
- Verify toast provider is in layout
- Check browser console for errors
- Try different browser

---

## Known Issues

1. **Currency Inconsistency**: Event reports show `$` in ticket type revenue cards but `₹` in total revenue. This should be consistent.

2. **User Active Status**: The `isActive` field exists in the user model but is not displayed in the main users table (only visible in user details page).

---

## Future Enhancements (Not Currently Available)

The following features are **not** currently implemented but could be added:

- ❌ **Bulk Operations**: No bulk delete/edit for events or users
- ❌ **Export Functionality**: Reports cannot be exported to CSV/PDF
- ❌ **Search/Filter**: No search or filter options in tables
- ❌ **Pagination**: All data loads at once (no pagination)
- ❌ **Keyboard Shortcuts**: No keyboard shortcuts available
- ❌ **Advanced Filtering**: Cannot filter bookings by date range, status, etc.
- ❌ **User Role Management**: Cannot change user roles from admin interface
- ❌ **Event Duplication**: Cannot duplicate existing events
- ❌ **Booking Refunds**: No refund functionality (only cancellation)

---

## Additional Resources

- **Making Users Admin**: See `MAKE_ADMIN_GUIDE.md`
- **Adding Dummy Data**: See `DUMMY_DATA_GUIDE.md`
- **Supabase Setup**: See `SUPABASE_SETUP.md`
- **Database Schema**: See `supabase-schema.sql`

---

*Last Updated: Based on current codebase implementation*
