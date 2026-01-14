import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Realtime clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString(undefined, options);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
        setIsDropdownOpen(false);
    };

    const getUserInitials = () => {
        if (!user?.name) return "U";
        return user.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-dark-900 flex justify-between items-start md:items-center p-3 lg:px-8 border-b border-gray-200 dark:border-dark-700">
            {/* Realtime Clock */}
            <div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`px-3 py-2 rounded-lg bg-gray-900/10 dark:bg-white/15  dark:text-black `}
                            >
                                <i className="fas fa-clock text-black dark:text-gray-400"></i>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatTime(currentTime)}
                                </h1>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                    {formatDate(currentTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                        {getUserInitials()}
                    </div>
                    {/* Desktop user info */}
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            @{user?.username || "Guest"}
                        </p>
                    </div>
                    <i
                        className={`fas fa-chevron-down text-xs text-gray-500 dark:text-gray-400 ${
                            isDropdownOpen ? "rotate-180" : ""
                        } transition-transform`}
                    ></i>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-50">
                        {/* User Profile Section - More Compact */}
                        <div className="p-3 border-b border-gray-200 dark:border-dark-700">
                            <div className="flex items-center">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium text-sm md:text-base">
                                        {getUserInitials()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                                        {user?.role || "Guest"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items - More Compact */}
                        <div className="p-1.5">
                            {/* Theme Toggle (Mobile) */}
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setIsDropdownOpen(false);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors mb-1 md:hidden"
                            >
                                <i
                                    className={`fas ${
                                        isDarkMode ? "fa-sun" : "fa-moon"
                                    } mr-2.5 text-gray-500 dark:text-gray-400 text-sm`}
                                ></i>
                                <span className="text-xs">
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            {/* Theme Toggle (Desktop) */}
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setIsDropdownOpen(false);
                                }}
                                className="hidden md:flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors mb-1"
                            >
                                <i
                                    className={`fas ${
                                        isDarkMode ? "fa-sun" : "fa-moon"
                                    } mr-2.5 text-gray-500 dark:text-gray-400`}
                                ></i>
                                <span>
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-dark-700 my-1.5 md:my-2"></div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
                            >
                                <i className="fas fa-sign-out-alt mr-2.5 text-gray-500 dark:text-gray-400"></i>
                                <span className="text-xs md:text-sm">
                                    Logout
                                </span>
                            </button>

                            {/* Mobile Footer Info */}
                            <div className="md:hidden pt-2 border-t border-gray-200 dark:border-dark-700 mt-2">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                                    App Version 1.0.0
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
