# Vite 代理配置示例

## 1. 基本 API 代理

```typescript
'/api': {
  target: 'http://localhost:3000',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api/, '')
}
```

## 2. 保留路径前缀

```typescript
'/api': {
  target: 'http://localhost:3000',
  changeOrigin: true
  // 不使用 rewrite，保留 /api 前缀
}
```

## 3. HTTPS 后端服务器

```typescript
'/api': {
  target: 'https://api.example.com',
  changeOrigin: true,
  secure: true, // 验证 SSL 证书
  rewrite: (path) => path.replace(/^\/api/, '')
}
```

## 4. 多个代理规则

```typescript
proxy: {
  // API 接口代理
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  },
  // 文件上传代理
  '/upload': {
    target: 'http://localhost:3001',
    changeOrigin: true
  },
  // WebSocket 代理
  '/ws': {
    target: 'ws://localhost:3002',
    ws: true, // 启用 WebSocket 代理
    changeOrigin: true
  }
}
```

## 5. 带认证的代理

```typescript
'/api': {
  target: 'http://localhost:3000',
  changeOrigin: true,
  configure: (proxy, options) => {
    proxy.on('proxyReq', (proxyReq, req, res) => {
      // 添加认证头
      proxyReq.setHeader('Authorization', 'Bearer your-token');
    });
  }
}
```

## 6. 条件代理

```typescript
'/api': {
  target: 'http://localhost:3000',
  changeOrigin: true,
  bypass: (req, res, options) => {
    // 根据条件决定是否代理
    if (req.headers.accept?.indexOf('html') !== -1) {
      return '/index.html';
    }
  }
}
```
