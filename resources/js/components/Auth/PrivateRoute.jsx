import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading, verifyToken } = useAuth();
    const [minLoadingComplete, setMinLoadingComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoadingComplete(true);
        }, 1000); // Minimum 2 second loading

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            if (!user && localStorage.getItem("token")) {
                await verifyToken();
            }
        };
        checkAuth();
    }, []);

    // Show loading for at least 2 seconds
    if (loading || !minLoadingComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Verifying session...
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.includes(user.role);
        if (!hasRequiredRole) {
            return <Navigate to="/" />;
        }
    }

    return children;
};

export default PrivateRoute;
