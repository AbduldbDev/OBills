import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-sm mx-auto text-center relative">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating Dots - Black and White */}
                    <div
                        className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-float"
                        style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                        className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-float"
                        style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                        className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-float"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/25 rounded-full animate-float"
                        style={{ animationDelay: "1.5s" }}
                    ></div>

                    {/* Small Dots */}
                    <div
                        className="absolute top-1/5 right-1/5 w-0.5 h-0.5 bg-white/10 rounded-full animate-float"
                        style={{
                            animationDelay: "0.2s",
                            animationDuration: "3s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-1/5 left-1/5 w-0.5 h-0.5 bg-white/15 rounded-full animate-float"
                        style={{
                            animationDelay: "0.7s",
                            animationDuration: "3s",
                        }}
                    ></div>

                    {/* Pulse Rings */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 border border-white/5 rounded-full animate-pulse-ring"></div>
                        <div
                            className="w-40 h-40 border border-white/10 rounded-full animate-pulse-ring"
                            style={{ animationDelay: "1s" }}
                        ></div>
                    </div>
                </div>

                {/* Animated Error Code - White */}
                <div className="relative mb-4 sm:mb-6">
                    <div className="text-[80px] sm:text-[100px] font-black text-dark-800 tracking-tight">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[80px] sm:text-[100px] font-black bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                            404
                        </div>
                    </div>

                    {/* Animated Dots around 404 - White */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-1 bg-white/60 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-1 bg-white/40 rounded-full animate-bounce"
                                    style={{
                                        animationDelay: `${i * 0.2 + 0.3}s`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4 sm:space-y-5 relative z-10">
                    {/* Title */}
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                        Page not found
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-400 px-2 sm:px-0">
                        The page you're looking for doesn't exist or has been
                        moved.
                    </p>

                    {/* Illustration with Thunder Logo */}
                    <div className="py-2 sm:py-3">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                            {/* Animated Orbiting Dots - White */}
                            <div className="absolute inset-0 animate-spin-slow">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                                </div>
                                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                    <div
                                        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"
                                        style={{ animationDelay: "0.5s" }}
                                    ></div>
                                </div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                    <div
                                        className="w-1 h-1 bg-white/70 rounded-full animate-pulse"
                                        style={{ animationDelay: "1s" }}
                                    ></div>
                                </div>
                                <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                                    <div
                                        className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"
                                        style={{ animationDelay: "1.5s" }}
                                    ></div>
                                </div>
                            </div>

                            {/* Center Circle with Thunder Logo */}
                            <div className="absolute inset-6 sm:inset-8 bg-dark-800 border border-dark-700 rounded-full flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white to-gray-300 rounded-lg flex items-center justify-center transform rotate-45">
                                        <i className="fas fa-bolt text-dark-900 text-lg sm:text-xl transform -rotate-45"></i>
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-white/10 blur-sm rounded-lg -z-10"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Black and White Only */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3">
                        <Link
                            to="/"
                            className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-white text-dark-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-lg"
                        >
                            <i className="fas fa-home text-xs sm:text-sm"></i>
                            Dashboard
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-dark-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 hover:bg-dark-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
                        >
                            <i className="fas fa-arrow-left text-xs sm:text-sm"></i>
                            Go Back
                        </button>
                    </div>

                    {/* Divider with Animated Dots - White */}
                    <div className="relative py-3 sm:py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-dark-900 text-gray-500 text-xs flex items-center gap-1">
                                <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                                <div
                                    className="w-1 h-1 bg-white/40 rounded-full animate-pulse"
                                    style={{ animationDelay: "0.3s" }}
                                ></div>
                                <div
                                    className="w-1 h-1 bg-white/50 rounded-full animate-pulse"
                                    style={{ animationDelay: "0.6s" }}
                                ></div>
                            </span>
                        </div>
                    </div>

                    {/* Quick Links - Black and White */}
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to="/units"
                            className="p-2.5 sm:p-3 bg-dark-800 hover:bg-dark-700 border border-gray-800 hover:border-white/30 rounded-lg transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute -right-2 -top-2 w-4 h-4 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="flex items-center gap-2 relative">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <i className="fas fa-building text-white text-xs sm:text-sm"></i>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs sm:text-sm font-medium text-white">
                                        Units
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400">
                                        Apartments
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link
                            to="/calculation"
                            className="p-2.5 sm:p-3 bg-dark-800 hover:bg-dark-700 border border-gray-800 hover:border-white/30 rounded-lg transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute -right-2 -top-2 w-4 h-4 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            <div className="flex items-center gap-2 relative">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <i className="fas fa-calculator text-white text-xs sm:text-sm"></i>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs sm:text-sm font-medium text-white">
                                        Calculation
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-gray-400">
                                        Billing
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Footer with Animated Dots - White */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-800">
                    <div className="flex justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 h-1 bg-gradient-to-r from-white to-gray-400 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">
                        Ongchad Bills Management
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
