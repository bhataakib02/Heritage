"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const { isSignedIn, isLoaded } = useUser();
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for sticky navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Wait for Clerk to load
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Sticky Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
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
                            className="px-4 md:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-5xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 animate-fade-in">
                            <i className="ri-star-fill"></i>
                            <span>Trusted by 10,000+ Cultural Enthusiasts</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
                            Explore Cultural
                            <span className="text-primary block mt-2">Heritage</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
                            Discover and book museum events, exhibitions, and cultural heritage experiences.
                            Connect with history, art, and culture in one place.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up delay-200">
                            <Link
                                href="/sign-up"
                                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <span>Start Exploring</span>
                                <i className="ri-arrow-right-line"></i>
                            </Link>
                            <Link
                                href="/sign-in"
                                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-xl font-semibold text-lg transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Stats Preview */}
                        <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto mt-16 animate-fade-in-up delay-300">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
                                <div className="text-sm md:text-base text-gray-600">Museums</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
                                <div className="text-sm md:text-base text-gray-600">Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
                                <div className="text-sm md:text-base text-gray-600">Bookings</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose Heritage World?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to explore cultural heritage in one seamless platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <i className="ri-museum-line text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Discover Museums
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Browse through hundreds of museums, exhibitions, and cultural events from around the world. Find your next adventure.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <i className="ri-calendar-check-line text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Easy Booking
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Book your tickets in seconds. Manage all your bookings in one convenient place with instant confirmations.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <i className="ri-star-line text-4xl text-primary"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Exclusive Events
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Access special exhibitions, guided tours, and cultural events not available elsewhere. Be the first to know.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Features Grid */}
            <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all">
                            <i className="ri-shield-check-line text-4xl text-primary mb-4"></i>
                            <h4 className="font-bold text-gray-900 mb-2">Secure Booking</h4>
                            <p className="text-sm text-gray-600">100% secure payment processing</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all">
                            <i className="ri-time-line text-4xl text-primary mb-4"></i>
                            <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
                            <p className="text-sm text-gray-600">Always here to help you</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all">
                            <i className="ri-refund-line text-4xl text-primary mb-4"></i>
                            <h4 className="font-bold text-gray-900 mb-2">Easy Cancellation</h4>
                            <p className="text-sm text-gray-600">Cancel anytime, no questions asked</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all">
                            <i className="ri-global-line text-4xl text-primary mb-4"></i>
                            <h4 className="font-bold text-gray-900 mb-2">Global Access</h4>
                            <p className="text-sm text-gray-600">Museums from around the world</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <h3 className="text-white text-xl font-bold mb-4">
                            <span className="text-primary">HERITAGE</span> WORLD
                        </h3>
                        <p className="text-sm mb-6 max-w-2xl mx-auto">
                            Your gateway to cultural heritage and museum experiences.
                        </p>
                        <div className="border-t border-gray-800 pt-6 text-sm">
                            <p>&copy; 2024 Heritage World. All rights reserved. Developed by Bhat Aakib</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
