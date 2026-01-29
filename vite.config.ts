import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Tanach',
      fileName: (format) => `tanach.${format}.js`,
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
