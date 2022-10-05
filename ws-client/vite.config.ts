import { defineConfig } from 'vite';

const cacheDir =
  process.env.NODE_ENV === 'development-docker'
    ? '/node/node_modules/.vite'
    : 'node_modules/.vite';

export default defineConfig({
  server: {
    host: true,
    port: +process.env.PORT! || 3001,
  },
  cacheDir,
});
