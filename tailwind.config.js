/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // This is important - uses class strategy
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                dark: {
                    50: "#fafafa",
                    100: "#e5e5e5",
                    200: "#d4d4d4",
                    300: "#a3a3a3",
                    400: "#737373",
                    500: "#525252",
                    600: "#404040",
                    700: "#262626",
                    800: "#171717",
                    900: "#0a0a0a",
                },
            },
            // fontFamily: {
            //     sans: ["Montserrat", "system-ui", "sans-serif"],
            // },
        },
    },
    plugins: [],
};
