import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/booking-calendar/", // Asegura que las rutas funcionen bien en GitHub Pages
  plugins: [react()],
});
