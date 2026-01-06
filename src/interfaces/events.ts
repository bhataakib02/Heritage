export interface EventType {
    name: string;
    description: string;
    organizer: string;
    guests: string[];

    date: string;
    time: string;
    location: string;

    images: string[];

    ticketTypes: {
        name: string;
        price: number;
        limit: number;
    }[];

    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
    user: any;
    _id?: string;
    id?: string;
}

export interface BookingType {
    event: EventType | string; // Can be populated event or just event ID
    ticketType: String;
    ticketsCount: Number;
    totalAmount: Number;
    paymentId: String;
    status: String;
    user: any;
    _id?: string;
    id?: string;
    createdAt?: string;
    created_at?: string;
}