import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ],
  output: 'static',
  build: {
    format: 'directory'
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    ssr: {
      noExternal: ['react-leaflet', 'leaflet']
    }
  }
});
