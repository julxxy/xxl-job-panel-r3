import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { isTrue } from './src/common/BooleanUtils.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@types': path.resolve(__dirname, 'types'),
      },
    },

    server: {
      allowedHosts: ['.fgct.cc', 'localhost'],
      open: isTrue(env.VITE_OPEN_BROWSER),
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '/api'),
        },
        '/job': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/job/, '/job'),
        },
        '/xxl-job-admin': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '/api'),
        },
      },
    },

    build: {
      sourcemap: false,
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  }
})
