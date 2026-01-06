/**
 * Normalize data between MongoDB and Supabase formats
 */

export function normalizeEvent(event: any): any {
    if (!event) return event;
    
    // Normalize ID
    if (event.id && !event._id) {
        event._id = event.id;
    }
    
    // Normalize timestamps
    if (event.created_at && !event.createdAt) {
        event.createdAt = event.created_at;
    }
    if (event.updated_at && !event.updatedAt) {
        event.updatedAt = event.updated_at;
    }
    
    return event;
}

export function normalizeBooking(booking: any, events?: any[]): any {
    if (!booking) return booking;
    
    // Normalize ID
    if (booking.id && !booking._id) {
        booking._id = booking.id;
    }
    
    // Normalize timestamps
    if (booking.created_at && !booking.createdAt) {
        booking.createdAt = booking.created_at;
    }
    
    // Populate event if event is just an ID and we have events array
    if (typeof booking.event === 'string' && events) {
        const event = events.find(e => (e.id || e._id) === booking.event);
        if (event) {
            booking.event = normalizeEvent(event);
        }
    }
    
    return booking;
}

export function normalizeUser(user: any): any {
    if (!user) return user;
    
    // Normalize ID
    if (user.id && !user._id) {
        user._id = user.id;
    }
    
    // Normalize timestamps
    if (user.created_at && !user.createdAt) {
        user.createdAt = user.created_at;
    }
    if (user.updated_at && !user.updatedAt) {
        user.updatedAt = user.updated_at;
    }
    
    return user;
}

