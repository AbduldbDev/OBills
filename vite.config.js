import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/", // REQUIRED for Hostinger
    plugins: [
        laravel({
            input: ["resources/js/main.jsx", "resources/css/app.css"],
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: "public/build",
        emptyOutDir: true,
    },
});
