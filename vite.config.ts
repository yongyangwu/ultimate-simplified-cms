import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), tailwindcss(), AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5174, // 开发服务器端口
    open: true, // 自动打开浏览器
    proxy: {
      // Mock 数据代理 - 走本地 mock 服务
      '/mock': {
        target: 'http://localhost:3001', // 本地 mock 服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mock/, '/mock')
      },
      // 代理所有 /api 请求到后端服务器
      '/api': {
        target: 'http://localhost:3000', // 后端服务器地址
        changeOrigin: true, // 改变请求头中的 origin
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // 如果需要代理其他路径，可以添加更多配置
      '/upload': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
