import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const webApiService = 'walrhouse-webapi';
const target =
  process.env[`services__${webApiService}__https__0`] ||
  process.env[`services__${webApiService}__http__0`];

const proxyOptions = target ? { target, secure: false, changeOrigin: true } : undefined;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: parseInt(process.env.PORT!),
    proxy: proxyOptions
      ? {
          '/api': proxyOptions,
          '/openapi': proxyOptions,
          '/scalar': proxyOptions,
        }
      : undefined,
  },
  build: {
    outDir: 'build',
  },
});
