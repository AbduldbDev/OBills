import React, { createContext, useState, useContext, useEffect } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for stored user session on app load
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await fetch(`${VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store user and token
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return { success: true, user: data.user, token: data.token };
        } catch (error) {
            setError(error.message);
            return {
                success: false,
                error:
                    error.message || "Invalid credentials. Please try again.",
            };
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");

            // Call logout API endpoint if exists
            if (token) {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
            }
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            // Clear user state
            setUser(null);
            setError(null);

            // Clear localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    };

    // Verify token on page refresh
    const verifyToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return true;
            } else {
                // Token invalid or expired
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
                return false;
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            return false;
        }
    };

    // Get authenticated headers for API calls
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                error,
                verifyToken,
                getAuthHeaders,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
