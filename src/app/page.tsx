"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const { isSignedIn, isLoaded } = useUser();

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

    // Middleware handles redirect for authenticated users
    // This component only renders for unauthenticated users

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900">
                    <span className="text-primary">HERITAGE</span> WORLD
                </div>
                <div className="flex gap-4">
                    {isSignedIn ? (
                        <>
                            <Link
                                href="/home"
                                className="px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href="/bookings"
                                className="px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                            >
                                My Bookings
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Explore Cultural
                        <span className="text-primary block">Heritage</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Discover and book museum events, exhibitions, and cultural heritage experiences.
                        Connect with history, art, and culture in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isSignedIn ? (
                            <Link
                                href="/home"
                                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            >
                                Explore Museums
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/sign-up"
                                    className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                                >
                                    Start Exploring
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Why Choose Heritage World?
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to explore cultural heritage
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature 1 */}
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-museum-line text-3xl text-primary"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Discover Museums
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Browse through hundreds of museums, exhibitions, and cultural events from around the world.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-calendar-check-line text-3xl text-primary"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Easy Booking
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Book your tickets in seconds. Manage all your bookings in one convenient place.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-star-line text-3xl text-primary"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Exclusive Events
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Access special exhibitions, guided tours, and cultural events not available elsewhere.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-10 text-primary-100">
                        Join thousands of cultural enthusiasts exploring heritage around the world
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isSignedIn ? (
                            <Link
                                href="/home"
                                className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            >
                                View All Museums
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/sign-up"
                                    className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-primary transition-all font-semibold text-lg"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-xl font-bold mb-4">
                                <span className="text-primary">HERITAGE</span> WORLD
                            </h3>
                            <p className="text-sm">
                                Your gateway to cultural heritage and museum experiences.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Explore</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href={isSignedIn ? "/home" : "/sign-up"} className="hover:text-primary transition-colors">Museums</Link></li>
                                <li><Link href={isSignedIn ? "/home" : "/sign-up"} className="hover:text-primary transition-colors">Events</Link></li>
                                <li><Link href={isSignedIn ? "/home" : "/sign-up"} className="hover:text-primary transition-colors">Exhibitions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Account</h4>
                            <ul className="space-y-2 text-sm">
                                {isSignedIn ? (
                                    <>
                                        <li><Link href="/bookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
                                        <li><Link href="/home" className="hover:text-primary transition-colors">Home</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link href="/sign-in" className="hover:text-primary transition-colors">Sign In</Link></li>
                                        <li><Link href="/sign-up" className="hover:text-primary transition-colors">Sign Up</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li>support@heritageworld.com</li>
                                <li>+1 (555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                        <p>&copy; 2024 Heritage World. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

