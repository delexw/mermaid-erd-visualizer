import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './single-html-build',
  build: {
    outDir: '../dist-singlehtml',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'single-html-build/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        inlineDynamicImports: true,
      },
    },
    assetsInlineLimit: 100000000, // Inline all assets
    cssCodeSplit: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
  },
});