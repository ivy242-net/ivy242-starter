import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: 'pb_hooks/pages/assets',
    lib: {
      entry: 'lib/index.js',
      name: 'IvyStarter',
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