import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/booking-calendar/",  // Asegúrate de escribir el nombre correcto del repo
  plugins: [react()],
});
