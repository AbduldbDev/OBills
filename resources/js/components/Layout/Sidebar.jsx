import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    const menuItems = [
        {
            id: 1,
            name: "Dashboard",
            icon: "fa-tachometer-alt",
            path: "/",
            roles: ["super_admin", "admin", "viewer"],
        },
        {
            id: 2,
            name: "Calculation",
            icon: "fa-calculator",
            path: "/calculation",
            roles: ["super_admin", "admin"],
        },
        {
            id: 3,
            name: "Bill Receipt",
            icon: "fa-receipt",
            path: "/bill-receipt",
            roles: ["super_admin", "admin", "viewer"],
        },
        {
            id: 4,
            name: "Apartments History",
            icon: "fa-building",
            path: "/apartments-history",
            roles: ["super_admin", "admin", "viewer"],
        },
        {
            id: 5,
            name: "Payment History",
            icon: "fa-credit-card",
            path: "/payment-history",
            roles: ["super_admin", "admin", "viewer"],
        },
        {
            id: 6,
            name: "Reading History",
            icon: "fa-file-alt",
            path: "/reading-history",
            roles: ["super_admin", "admin", "viewer"],
        },
        {
            id: 7,
            name: "Calendar",
            icon: "fa-calendar-alt",
            path: "/calendar",
            roles: ["super_admin", "admin", "viewer"],
        },
        {
            id: 8,
            name: "Accounts",
            icon: "fa-user-circle",
            path: "/accounts",
            roles: ["super_admin", "admin"],
        },
        {
            id: 9,
            name: "Units",
            icon: "fa-home",
            path: "/units",
            roles: ["super_admin", "admin", "viewer"],
        },
    ];

    // Filter menu items based on user role
    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(user?.role?.toLowerCase())
    );

    const getUserInitials = () => {
        if (!user?.name) return "U";
        return user.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Desktop Sidebar
    const DesktopSidebar = () => (
        <aside
            className={`h-screen bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 fixed left-0 top-0 transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-16" : "w-64"
            }`}
            style={{ height: "100vh" }}
        >
            {/* Logo and Toggle */}
            <div className="flex items-center justify-between h-[79px] border-b border-gray-200 dark:border-dark-700 px-4">
                {!isCollapsed && (
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        <i className="fas fa-bolt mr-2"></i>ONGCHAD
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <i
                        className={`fas ${
                            isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
                        } text-gray-600 dark:text-gray-400`}
                    ></i>
                </button>
            </div>

            {/* User Profile - Desktop */}
            {user && !isCollapsed && (
                <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full  bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                            <span className="  text-blue-600 font-semibold">
                                {getUserInitials()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {user.role
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                    )}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav
                className="p-4 overflow-y-auto"
                style={{ height: "calc(100vh - 8rem)" }}
            >
                <ul className="space-y-1">
                    {filteredMenuItems.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                                    } ${
                                        isCollapsed
                                            ? "justify-center px-2"
                                            : "px-3"
                                    }`
                                }
                            >
                                <i
                                    className={`fas ${item.icon} ${
                                        isCollapsed ? "" : "mr-3"
                                    } w-5 text-center`}
                                ></i>
                                {!isCollapsed && (
                                    <span className="whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
                <div className="space-y-2">
                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className={`flex items-center ${
                            isCollapsed ? "justify-center" : ""
                        } w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors`}
                    >
                        <i
                            className={`fas fa-sign-out-alt ${
                                isCollapsed ? "" : "mr-3"
                            }`}
                        ></i>
                        {!isCollapsed && "Logout"}
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`flex items-center ${
                            isCollapsed ? "justify-center" : ""
                        } w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors`}
                    >
                        <i
                            className={`fas ${
                                isDarkMode ? "fa-sun" : "fa-moon"
                            } ${isCollapsed ? "" : "mr-3"}`}
                        ></i>
                        {!isCollapsed &&
                            (isDarkMode ? "Light Mode" : "Dark Mode")}
                    </button>
                </div>
            </div>
        </aside>
    );
    // Mobile Sidebar
    const MobileSidebar = () => (
        <>
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Panel */}
            <div
                className={`md:hidden fixed top-0 left-0 h-full bg-white dark:bg-dark-800 z-100 w-64 transform transition-transform duration-300 ease-in-out ${
                    isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Mobile Sidebar Header */}
                <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-dark-700 px-4">
                    <div className="flex items-center">
                        <i className="fas fa-bolt text-xl text-gray-900 dark:text-white mr-3"></i>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            ONGCHAD
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    >
                        <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
                    </button>
                </div>

                {/* User Profile - Mobile */}
                {user && (
                    <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-medium text-lg">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {user.role
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (char) =>
                                            char.toUpperCase()
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Navigation Menu */}
                <nav className="p-4 overflow-y-auto h-[calc(100vh-12rem)]">
                    <ul className="space-y-1">
                        {filteredMenuItems.map((item) => (
                            <li key={item.id}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/"}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? "bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                                        }`
                                    }
                                    onClick={() =>
                                        setIsMobileSidebarOpen(false)
                                    }
                                >
                                    <i
                                        className={`fas ${item.icon} mr-3 w-5 text-center`}
                                    ></i>
                                    <span className="whitespace-nowrap">
                                        {item.name}
                                    </span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
                    <div className="space-y-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsMobileSidebarOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                        >
                            <i
                                className={`fas ${
                                    isDarkMode ? "fa-sun" : "fa-moon"
                                } mr-3`}
                            ></i>
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                logout();
                                setIsMobileSidebarOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                        >
                            <i className="fas fa-sign-out-alt mr-3"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Hamburger Button (floating) */}
            <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden fixed top-4 left-3 z-50 px-3 py-2 rounded-lg bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-gray-200 dark:border-dark-700 "
            >
                <i className="fas fa-bars text-gray-700 dark:text-gray-300"></i>
            </button>
        </>
    );

    return (
        <>
            <div className="hidden md:block">
                <DesktopSidebar />
            </div>
            <div className="md:hidden">
                <MobileSidebar />
            </div>
        </>
    );
};

export default Sidebar;
