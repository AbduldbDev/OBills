import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";

// Initialize dark mode on load
const initDarkMode = () => {
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    const isDarkMode = stored ? JSON.parse(stored) : prefersDark;

    if (isDarkMode) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

initDarkMode();

// Use getElementById('root') - make sure your HTML has <div id="root">
const rootElement = document.getElementById("app");

if (!rootElement) {
    console.error(
        "Root element not found! Make sure your HTML has <div id='root'></div>"
    );
    throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <SidebarProvider>
                        <App />
                    </SidebarProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
