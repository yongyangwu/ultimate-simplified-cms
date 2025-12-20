了解本项目你需要学习如何配置prettier进行代码格式化
我们需要安装一个标准vue项目最常用的一些npm包
vue-router axios sass-embedded vue-i18n nprogress pinia pinia-plugin-persistedstate

### 常见问题解决方案

1. **Axios 请求封装**
   - 实现请求时自动添加全局 loading，成功或失败均在拦截器中统一提示，避免重复代码。
   - 支持配置 `loading: false`，允许针对特定接口关闭全局 loading 进行局部处理。

2. **Mock 数据与 BaseURL 配置**
   - 支持配置 Mock 请求实例与正常请求实例的 BaseURL。
   - 开发环境下可对未完成的后端接口进行 Mock，同时现有接口继续走正常流程。

3. **路由守卫**
   - 支持配置全局路由守卫与局部路由守卫。
   - 在路由守卫中进行权限判断，无权限时自动跳转至登录页。

4. **多语言支持 (i18n)**
   - 集成 i18n 支持多语言。
   - 根据用户设置动态显示对应语言。
