import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "../../context/SidebarContext";

const Layout = ({ children }) => {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen bg-white dark:bg-dark-900">
            {/* Desktop Sidebar Container */}
            <Sidebar />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                    isCollapsed ? "md:ml-16" : "md:ml-64"
                }`}
            >
                {/* Fixed Header */}
                <div className="sticky top-0 z-30">
                    <Header />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto px-5 lg:px-8 py-5">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
