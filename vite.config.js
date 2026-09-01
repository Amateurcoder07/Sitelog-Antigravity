import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      // manifest: {
      //   name: 'TerraCore.ai',
      //   short_name: 'TerraCore',
      //   description: 'The only construction site management software you will ever need.',
      //   theme_color: '#ffffff',
      //   icons: [
      //     { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      //     { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
      //   ]
      // }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})