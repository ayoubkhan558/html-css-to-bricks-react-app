import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import the path module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' to the 'src' directory
      // You can add more aliases here, e.g.:
      '@components': path.resolve(__dirname, './src/components'),
      '@generator': path.resolve(__dirname, './src/generator'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});