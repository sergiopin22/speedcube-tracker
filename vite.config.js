import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SpeedCube Tracker',
        short_name: 'SpeedCube',
        description: 'Seguimiento de algoritmos OLL y PLL para speedcubing',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0c0c14',
        background_color: '#0c0c14',
        icons: [
          {
            src: '/cube.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
