"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");

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
        const params = new URLSearchParams();
        if (searchName) params.set('name', searchName);
        if (searchDate) params.set('date', searchDate);
        router.push(`/home?${params.toString()}`);
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

    // If somehow an authenticated user reaches here (shouldn't happen due to middleware),
    // redirect immediately without showing content
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
                    <div className="flex gap-4 items-center">
                        <Link
                            href="/sign-in"
                            className="px-4 md:px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="px-4 md:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Search */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Discover Cultural Heritage
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Book museum events, exhibitions, and cultural experiences
                        </p>
                    </div>

                    {/* Search Form - Booking.com Style */}
                    <div className="max-w-5xl mx-auto">
                        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="ri-search-line mr-2"></i>
                                        Search Museum
                                    </label>
                                    <input
                                        type="text"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        placeholder="Enter museum name..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
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

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-white">
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
                            href="/sign-up"
                            className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            href="/sign-in"
                            className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold text-lg"
                        >
                            Sign In
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
