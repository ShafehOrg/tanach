import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        preferred: resolve(__dirname, 'src/preferred.ts'),
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [],
      output: {
        exports: 'named'
      }
    },
    sourcemap: true,
    minify: 'terser'
  }
});
