"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch events from database - with ULTRA aggressive cache busting
    const fetchEvents = async (forceRefresh = false) => {
        try {
            setLoading(true);
            // Multiple cache-busting parameters to ensure fresh data
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const refresh = forceRefresh ? refreshKey + 1 : refreshKey;
            const cacheBuster = `cb_${timestamp}_${random}_${Math.random().toString(36).substring(7)}`;
            const version = `v${Date.now()}_${Math.random().toString(36).substring(7)}`;
            
            // Build URL with multiple cache-busting params
            const url = `/api/events/public?t=${timestamp}&r=${random}&_=${Date.now()}&refresh=${refresh}&cb=${cacheBuster}&v=${version}&nocache=${Math.random()}&force=${Date.now()}`;
            
            // Use native fetch with cache: 'no-store' instead of axios for better cache control
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-store', // Critical: Force no caching
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'X-Request-Time': timestamp.toString(),
                    'X-No-Cache': 'true',
                    'X-Force-Refresh': forceRefresh ? 'true' : 'false',
                    'X-Version': version,
                },
            });
            
            // Parse response
            const data = await response.json();
            if (data.success) {
                const fetchedEvents = data.events || [];
                // ALWAYS update state - even if empty array
                setEvents(fetchedEvents);
                console.log("✅ Fetched events:", fetchedEvents.length, "at", new Date().toISOString());
                console.log("📊 API Response:", {
                    success: data.success,
                    eventCount: fetchedEvents.length,
                    timestamp: data.timestamp,
                    requestId: data.requestId,
                    dbInfo: data._dbInfo,
                    fetchedAt: data.fetchedAt
                });
                if (fetchedEvents.length > 0) {
                    console.warn("⚠️ WARNING: Database contains", fetchedEvents.length, "event(s)!");
                    console.warn("⚠️ Event names:", fetchedEvents.map((e: Event) => e.name));
                    console.warn("⚠️ Database:", data._dbInfo);
                    console.warn("⚠️ Response headers:", {
                        'cache-control': response.headers.get('cache-control'),
                        'x-request-id': response.headers.get('x-request-id'),
                    });
                    console.warn("⚠️ This might be cached data - try hard refresh (Ctrl+Shift+R)");
                } else {
                    console.log("✅ Database is empty - no events found");
                }
                
                // If no events and searchName is set, clear it
                if (fetchedEvents.length === 0 && searchName) {
                    setSearchName("");
                    setShowDropdown(false);
                }
            } else {
                console.error("❌ API returned success: false");
                setEvents([]);
                // Clear search if API fails
                if (searchName) {
                    setSearchName("");
                    setShowDropdown(false);
                }
            }
        } catch (error) {
            console.error("❌ Error fetching events:", error);
            // Always set to empty array on error
            setEvents([]);
            // Clear search on error
            if (searchName) {
                setSearchName("");
                setShowDropdown(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // Manual refresh function - with cache clearing
    const handleRefresh = () => {
        // Clear browser cache
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
                console.log("🗑️ Cleared browser cache");
            });
        }
        setRefreshKey(prev => prev + 1);
        fetchEvents(true);
    };

    useEffect(() => {
        // Clear any cached data before fetching
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Fetch immediately on mount
        fetchEvents(false);
    }, []);

    useEffect(() => {
        // Refetch when refreshKey changes
        if (refreshKey > 0) {
            fetchEvents(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    useEffect(() => {
        // Also fetch on window focus (when user returns to tab)
        const handleFocus = () => {
            setRefreshKey(prev => prev + 1);
        };
        window.addEventListener('focus', handleFocus);
        
        // Cleanup
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Clear search if events become empty
    useEffect(() => {
        if (events.length === 0 && searchName) {
            console.log("🔄 Clearing search - no events in database");
            setSearchName("");
            setShowDropdown(false);
        }
    }, [events, searchName]);


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

    // Featured museum images - always show these 3 beautiful museum images from public folder
    const featuredMuseumImages = [
        '/images/museums/museum1.jpg', // Grand museum interior
        '/images/museums/museum2.jpg', // Natural history museum
        '/images/museums/museum3.jpg'  // Museum exhibit hall
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Top Navigation Header - Museum Style */}
            <header className="w-full bg-white border-b-2 border-gray-200 shadow-sm py-4 md:py-5">
                <div className="container mx-auto px-6">
                    <nav className="flex items-center justify-center relative">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                            <span className="text-amber-600">HERITAGE</span>{" "}
                            <span className="text-gray-800">WORLD</span>
                        </h1>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="absolute right-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            title="Refresh museums list"
                        >
                            <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section with Museum Images - Full Width */}
            <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 w-full">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Discover Cultural Heritage
                        </h2>
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

                    {/* Featured Museum Images - Always show 3 beautiful museum images */}
                    <div className="max-w-6xl mx-auto mt-12">
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredMuseumImages.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
                                >
                                    <div className="aspect-video bg-gray-200 overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={`Museum ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="eager"
                                            width={1200}
                                            height={800}
                                            style={{
                                                imageRendering: 'auto',
                                                objectFit: 'cover',
                                                minHeight: '100%',
                                                minWidth: '100%'
                                            }}
                                            onError={(e) => {
                                                // Fallback to placeholder if image not found
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop&q=95';
                                            }}
                                        />
            </div>
          </div>
        ))}
      </div>
                    </div>

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
                                        Visit Date
                                    </label>
                                    <input
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        placeholder="Select visit date"
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
            <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-y border-gray-200">
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

            {/* Museums Section - Only visible when museum is selected */}
            {searchName && (
                <section id="museums-section" className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Selected Museum: {searchName}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Book your tickets for this museum
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading museum...</p>
                            </div>
                        ) : filteredEvents.length > 0 ? (
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
                        ) : (
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
      )}
                    </div>
                </section>
            )}

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
