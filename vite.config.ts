import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  base: './',
  optimizeDeps: {
    include: ['pinyin-pro'],
  },
  build: {
    // 强制把 pinyin-pro 整体打包到 main bundle，避免被 tree-shake
    // （pinyin-pro 的 customPinyin/addDict 内部被错误地误判为 unused export）
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})