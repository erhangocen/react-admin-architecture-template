import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // server: {
  //   host: true, // Tüm ağ arayüzlerini dinler
  //   port: 5173, // Varsayılan portu belirtebilirsiniz
  //   strictPort: true, // Bu portu kullanamazsa hata verecek, yeni port aramayacak
  //   watch: {
  //     usePolling: true, // Docker'da dosya izleme için polling kullanılması gerekebilir
  //   },
  // },
  preview: {
    host: true,
    port: 80,
  },
})
