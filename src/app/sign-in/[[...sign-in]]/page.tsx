"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">HERITAGE WORLD</h1>
                    <p className="text-gray-600 text-sm">Discover and explore cultural heritage</p>
                </div>

                {/* Sign In Card */}
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm">Sign in to continue to Heritage World</p>
                    </div>
                    
                    <SignIn 
                        appearance={{
                            elements: {
                                rootBox: "mx-auto w-full",
                                card: "shadow-none border-0 bg-transparent",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md",
                                socialButtonsBlockButtonText: "text-gray-700 font-medium",
                                socialButtonsBlockButtonArrow: "text-gray-500",
                                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md",
                                footerActionLink: "text-primary hover:text-primary/80 font-medium transition-colors",
                                formFieldInput: "border-gray-300 focus:border-primary focus:ring-primary focus:ring-2",
                                formFieldLabel: "text-gray-700 font-medium",
                                identityPreviewText: "text-gray-700",
                                identityPreviewEditButton: "text-primary hover:text-primary/80",
                                dividerLine: "bg-gray-200",
                                dividerText: "text-gray-500 text-sm",
                                formResendCodeLink: "text-primary hover:text-primary/80",
                            },
                            layout: {
                                socialButtonsPlacement: "top",
                                showOptionalFields: false,
                            },
                        }}
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        afterSignInUrl="/home"
                        redirectUrl="/home"
                    />
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        By signing in, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

