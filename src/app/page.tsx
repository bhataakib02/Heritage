"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

interface Event {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    location: string;
    date: string;
    time: string;
    images?: string[];
}

export default function LandingPage() {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Fetch events from database
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events/public');
                if (response.data.success) {
                    const fetchedEvents = response.data.events || [];
                    setEvents(fetchedEvents);
                    console.log("Fetched events:", fetchedEvents.length);
                } else {
                    console.error("API returned success: false");
                    setEvents([]);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Handle scroll for sticky navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter events locally
        setLoading(true);
        setTimeout(() => setLoading(false), 100);
    };

    // Filter events for dropdown suggestions
    const searchSuggestions = events.filter((event) => {
        if (!searchName) return false;
        return event.name?.toLowerCase().includes(searchName.toLowerCase());
    }).slice(0, 5);

    // Filter events based on search for display
    const filteredEvents = (!searchName && !searchDate) 
        ? events 
        : events.filter((event) => {
            const nameMatch = !searchName || event.name?.toLowerCase().includes(searchName.toLowerCase());
            
            let dateMatch = true;
            if (searchDate) {
                let searchDateFormatted = searchDate;
                if (searchDate.includes('-') && searchDate.split('-')[0].length === 2) {
                    const [day, month, year] = searchDate.split('-');
                    searchDateFormatted = `${year}-${month}-${day}`;
                }
                
                const eventDate = event.date || '';
                dateMatch = eventDate === searchDate || eventDate === searchDateFormatted || 
                           eventDate.includes(searchDate) || searchDate.includes(eventDate);
            }
            
            return nameMatch && dateMatch;
        });

    const handleMuseumSelect = (museumName: string) => {
        setSearchName(museumName);
        setShowDropdown(false);
        setSearchFocused(false);
        // Scroll to museums section after selection
        setTimeout(() => {
            document.getElementById('museums-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Wait for Clerk to load
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isSignedIn) {
        if (typeof window !== 'undefined') {
            window.location.replace('/home');
        }
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    // Get featured museums (first 3 with images)
    const featuredMuseums = events.filter(e => e.images && e.images.length > 0).slice(0, 3);

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-md' : 'bg-white/95'
            }`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                        <span className="text-primary">HERITAGE</span> WORLD
                    </div>
                </div>
            </nav>

            {/* Hero Section with Museum Images */}
            <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Discover Cultural Heritage
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Book museum events, exhibitions, and cultural experiences
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/sign-in"
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg font-semibold"
                            >
                                Sign In to Book Tickets
                            </Link>
                            <Link
                                href="/sign-up"
                                className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Featured Museum Images */}
                    {featuredMuseums.length > 0 && (
                        <div className="max-w-6xl mx-auto mt-12">
                            <div className="grid md:grid-cols-3 gap-4">
                                {featuredMuseums.map((museum, index) => (
                                    <div
                                        key={museum.id || museum._id}
                                        className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                                    >
                                        <div className="aspect-video bg-gray-200 overflow-hidden">
                                            <img
                                                src={museum.images?.[0] || '/placeholder-image.jpg'}
                                                alt={museum.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                                            <div className="p-4 text-white w-full">
                                                <h3 className="font-bold text-lg mb-1">{museum.name}</h3>
                                                <p className="text-sm text-white/90">{museum.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Form */}
                    <div className="max-w-5xl mx-auto mt-8">
                        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="ri-search-line mr-2"></i>
                                        Search Museum
                                    </label>
                                    <input
                                        type="text"
                                        value={searchName}
                                        onChange={(e) => {
                                            setSearchName(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => {
                                            setSearchFocused(true);
                                            setShowDropdown(true);
                                        }}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                setSearchFocused(false);
                                                setShowDropdown(false);
                                            }, 300);
                                        }}
                                        onClick={() => {
                                            setSearchFocused(true);
                                            setShowDropdown(true);
                                        }}
                                        placeholder="Enter museum name..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    {showDropdown && searchFocused && (
                                        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                                            {searchName && searchSuggestions.length > 0 ? (
                                                searchSuggestions.map((event) => (
                                                    <button
                                                        key={event.id || event._id}
                                                        type="button"
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => handleMuseumSelect(event.name)}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <div className="font-semibold text-gray-900">{event.name}</div>
                                                        <div className="text-sm text-gray-600">{event.location}</div>
                                                    </button>
                                                ))
                                            ) : !searchName && events.length > 0 ? (
                                                events.slice(0, 10).map((event) => (
                                                    <button
                                                        key={event.id || event._id}
                                                        type="button"
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={() => handleMuseumSelect(event.name)}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <div className="font-semibold text-gray-900">{event.name}</div>
                                                        <div className="text-sm text-gray-600">{event.location}</div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 text-sm">
                                                    No museums found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="ri-calendar-line mr-2"></i>
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            >
                                Search Museums
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-8 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <i className="ri-shield-check-line text-2xl text-primary"></i>
                            <span className="font-semibold">Secure Booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="ri-customer-service-2-line text-2xl text-primary"></i>
                            <span className="font-semibold">24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="ri-star-fill text-2xl text-yellow-400"></i>
                            <span className="font-semibold">Happy Users</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="ri-refund-line text-2xl text-primary"></i>
                            <span className="font-semibold">Easy Cancellation</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Museums Section */}
            <section id="museums-section" className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {searchName ? `Selected Museum: ${searchName}` : "Explore Our Museums"}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {searchName 
                                ? "Book your tickets for this museum" 
                                : "Select a museum from the search above to view details"}
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading museums...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg mb-4">
                                No museums available at the moment.
                            </p>
                            <Link
                                href="/sign-up"
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold inline-block"
                            >
                                Sign Up to Add Museums
                            </Link>
                        </div>
                    ) : searchName && filteredEvents.length > 0 ? (
                        // Show only selected museum
                        <div className="max-w-4xl mx-auto">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id || event._id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                                >
                                    <div className="h-64 md:h-80 bg-gray-200 overflow-hidden">
                                        <img
                                            src={event.images?.[0] || '/placeholder-image.jpg'}
                                            alt={event.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                            {event.name}
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {event.description}
                                        </p>
                                        <div className="space-y-3 mb-6 text-gray-700">
                                            <div className="flex items-center gap-2 text-lg">
                                                <i className="ri-map-pin-line text-primary text-xl"></i>
                                                <span className="font-semibold">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-lg">
                                                <i className="ri-calendar-line text-primary text-xl"></i>
                                                <span className="font-semibold">{event.date} at {event.time}</span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/sign-up"
                                            className="block w-full text-center px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                                        >
                                            Create Account to Book Tickets
                                        </Link>
                                        <p className="text-center text-sm text-gray-500 mt-4">
                                            Already have an account? <Link href="/sign-in" className="text-primary hover:underline">Sign In</Link>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchName && filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg mb-4">
                                No museum found matching "{searchName}". Please try another search.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchName("");
                                    setSearchDate("");
                                }}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg mb-4">
                                Please select a museum from the search bar above to view details and book tickets.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Heritage World?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to explore cultural heritage in one place
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <i className="ri-museum-line text-3xl text-primary"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Discover Museums
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Browse hundreds of museums, exhibitions, and cultural events from around the world.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <i className="ri-calendar-check-line text-3xl text-primary"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Easy Booking
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Book your tickets in seconds with instant confirmation and easy management.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                                <i className="ri-star-line text-3xl text-primary"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Exclusive Events
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Access special exhibitions and cultural events not available elsewhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to Explore?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of cultural enthusiasts discovering heritage around the world
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/sign-in"
                            className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                        >
                            Sign In to Book Tickets
                        </Link>
                        <Link
                            href="/sign-up"
                            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold text-lg"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-6">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <h3 className="text-white text-lg font-bold mb-2">
                            <span className="text-primary">HERITAGE</span> WORLD
                        </h3>
                        <p className="text-xs mb-3 max-w-2xl mx-auto">
                            Your gateway to cultural heritage and museum experiences.
                        </p>
                        <div className="border-t border-gray-800 pt-3 text-xs">
                            <p>&copy; 2024 Heritage World. All rights reserved. Developed by Bhat Aakib</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
