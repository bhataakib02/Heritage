'use client'
import { UserButton } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

function LayoutProviders({ children }: { children: React.ReactNode }) {
    const [showButtons, setShowButtons] = useState<boolean>(false);

    const menusForAdmin = [
        {
            title: "Home",
            path: "/home",
        },
        {
            title: "Dashboard",
            path: "/admin/dashboard",
        },
        {
            title: "All Museums",
            path: "/admin/events",
        },
        {
            title: "All Bookings",
            path: "/admin/bookings",
        },
        {
            title: "All Users",
            path: "/admin/users",
        },
        {
            title: "Reports",
            path: "/admin/reports",
        },
    ];

    const menusForUser = [
        {
            title: "Home",
            path: "/home",
        },
        {
            title: "Bookings",
            path: "/bookings",
        },
    ];

    const pathname = usePathname();
    const router = useRouter();
    const [menusToShow, setMenusToShow] = React.useState<any[]>([]);
    // Hide navigation on landing page, sign-in, and sign-up pages
    const isPrivateRoute = !["/", "/landing", "/sign-in", "/sign-up"].includes(pathname);
    const getUserData = async () => {
        try {
            const response = await axios.get('/api/current-user');
            // Add null check to prevent "Cannot read properties of null" error
            if (response.data?.user && response.data.user.isAdmin) {
                setMenusToShow(menusForAdmin);
            } else {
                // Default to user menus if user is null or not admin
                setMenusToShow(menusForUser);
            }
        } catch (error: any) {
            console.log("error", error);
            // Don't show error toast for 401/unauthorized - user might not be logged in yet
            if (error.response?.status !== 401 && error.response?.status !== 500) {
                toast.error(error.message);
            }
            // Default to user menus on error
            setMenusToShow(menusForUser);
        }
    };

    useEffect(() => {
        if (isPrivateRoute) {
            // Add timeout to prevent infinite loading
            const timeoutId = setTimeout(() => {
                // If getUserData takes too long, set default menus
                if (menusToShow.length === 0) {
                    setMenusToShow(menusForUser);
                }
            }, 5000); // 5 second timeout
            
            getUserData().finally(() => {
                clearTimeout(timeoutId);
            });
            
            return () => clearTimeout(timeoutId);
        }
    }, [isPrivateRoute]);

    const handleToggleButtons = (e: React.MouseEvent) => {
        // Prevent the event from propagating to the document
        e.stopPropagation();
        setShowButtons(!showButtons);
    };

    const handleClickOutside = () => {
        if (showButtons) {
            setShowButtons(false);
        }
    };

    useEffect(() => {
        // Add event listener to handle clicks outside
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showButtons]);

    return (
        <div className="bg-gray-200 lg:px-20 px-5">
            {isPrivateRoute && (
                <div className="bg-white flex flex-col md:flex-row justify-between items-center shadow px-3 py-5 gap-4">
                    <h1
                        className="font-semibold text-xl md:text-2xl cursor-pointer text-blue-900"
                        onClick={() => router.push("/home")}
                    >HERITAGE WORLD</h1>

                    <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center">
                        {/* Navigation Links */}
                        <nav className="flex flex-wrap gap-2 md:gap-4 items-center">
                                {menusToShow.map((menu) => (
                                <Link
                                        key={menu.title}
                                    href={menu.path}
                                    className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                                        pathname === menu.path
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                        {menu.title}
                                </Link>
                                ))}
                        </nav>

                        {/* User Profile Button */}
                        <div className="flex items-center">
                        <UserButton
                            afterSignOutUrl="/"
                        />
                        </div>
                    </div>
                </div>
            )}
            <div className="py-5">
                {children}
            </div>

            {/* Triangular Pattern Buttons */}
            {showButtons && (
                <>
                    <button
                        onClick={() => window.open('https://cdn.botpress.cloud/webchat/v2/shareable.html?botId=43c4b622-f399-442b-ad04-ac65d51ae867', '_blank')} // Redirect to Botpress
                        style={{
                            position: 'fixed',
                            bottom: '80px',
                            right: '70px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#374151',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            zIndex: 1000,
                        }}
                    >
                        <i className="ri-chat-3-fill"></i>
                    </button>
                    <button
                        onClick={() => window.open('https://cdn.botpress.cloud/webchat/v2/shareable.html?botId=43c4b622-f399-442b-ad04-ac65d51ae867', '_blank')} // Redirect to Dialogflow
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#374151',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            zIndex: 1000,
                        }}
                    >
                        3
                    </button>
                    <button
                        onClick={() => window.open('https://vapi.ai?demo=true&shareKey=b8edd288-1cc7-42f7-9a69-686c78473d28&assistantId=107f59d7-c28b-405e-a3c1-041648bd38f5', '_blank')} // Redirect to Vapi Assistant.
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '120px', // Positioned to form a triangular pattern
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#374151',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            zIndex: 1000,
                        }}
                    >
                        <i className="ri-mic-fill"></i>
                    </button>
                </>
            )}
            <button
                onClick={handleToggleButtons}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#374151',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                <i className="ri-chat-voice-fill"></i>
            </button>

            {/* Icon with Increased Size */}
            <style jsx>{`
                .large-icon {
                    font-size: 50px; /* Adjust the size */
                }
            `}</style>
            {/* 
            <div className="flex justify-center items-center min-h-screen">
                <iframe
                    width="350"
                    height="430"
                    allow="microphone;"
                    src="https://console.dialogflow.com/api-client/demo/embedded/8604661f-6a06-4dee-98e0-58722a702263"
                    style={{ border: 'none' }} // Optional: Remove the border if needed
                ></iframe>
            </div> */}

        </div>
    );
}

export default LayoutProviders;
