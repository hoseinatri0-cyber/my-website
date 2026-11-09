import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The preview proxy forwards requests with Host: <port>-<sandbox id>.$BASE44_SANDBOX_HOST_DOMAIN.
// The sandbox id rotates, so the allowlist is extended with the domain wildcard rather than
// an exact host. Only applied when running inside the Base44 preview environment.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1'
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 400,
    },
    // __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS is supplied by the platform.
    allowedHosts: previewMode && sandboxHostDomain ? [`.${sandboxHostDomain}`] : undefined,
    proxy: {
      // Single-origin wiring: the browser only ever talks to port 3000, so auth
      // cookies stay first-party and no CORS handling is required.
      '/api': {
        target: 'http://api:5000',
        changeOrigin: false,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})
