import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tensorflow': ['@tensorflow/tfjs', '@tensorflow-models/mobilenet']
        }
      }
    }
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  }
});