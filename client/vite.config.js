import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [
    preact(),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.js',
      name: 'Ivy242Starter',
      fileName: 'lib',
      // formats: ['es', 'umd'] // choose whichever you need
      formats: ['iife'],
    },
    rollupOptions: {
      // Make sure to externalize dependencies you don’t want bundled
      // external: ['preact']
    },
  },
});