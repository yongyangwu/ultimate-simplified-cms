import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 开发服务器端口
    open: true, // 自动打开浏览器
    proxy: {
      // 代理所有 /api 请求到后端服务器
      '/api': {
        target: 'http://localhost:3000', // 后端服务器地址
        changeOrigin: true, // 改变请求头中的 origin
        rewrite: (path) => path.replace(/^\/api/, '/api') // 重写路径，移除 /api 前缀
      },
      // 如果需要代理其他路径，可以添加更多配置
      '/upload': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
