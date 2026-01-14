import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first
        const stored = localStorage.getItem("darkMode");
        if (stored !== null) {
            return JSON.parse(stored);
        }

        // ✅ Default to dark mode
        return true;
    });

    useEffect(() => {
        const html = document.documentElement;

        if (isDarkMode) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }

        localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
