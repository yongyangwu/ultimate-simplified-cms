import axios from "axios";
import { ElMessage, ElLoading } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading';

// 是否开启本地mock
// const MOCK_FLAG = import.meta.env.VITE_APP_OPEN_MOCK === "true";

let loadingInstance: LoadingInstance | null = null;
let requestCount = 0;

// 显示 loading
const showLoading = () => {
    if (requestCount === 0) {
        loadingInstance = ElLoading.service({
            fullscreen: true,
            lock: true,
            text: '加载中...',
            // background: 'rgba(0, 0, 0, 0.7)'
        });
    }
    requestCount++;
};

// 隐藏 loading
const hideLoading = () => {
    requestCount--;
    if (requestCount === 0 && loadingInstance) {
        loadingInstance.close();
        loadingInstance = null;
    }
};

// 创建axios实例
const service = axios.create({
    baseURL: "/api",
    timeout: 20000 // 超时时间 20 秒
});
const mockService = axios.create({
    baseURL: "/mock",
    timeout: 20000 // 超时时间 20 秒
});

// 请求拦截器
service.interceptors.request.use(
    function (config: any) {
        // 发送请求之前显示 loading
        showLoading();
        // 获取token鉴权

        return config;
    },
    function (error: any) {
        // 请求错误时隐藏 loading
        hideLoading();
        ElMessage.error('请求发送失败');
        return Promise.reject(error);
    }
);

mockService.interceptors.request.use(
    function (config: any) {
        showLoading();
        return config;
    },
    function (error: any) {
        hideLoading();
        ElMessage.error('请求发送失败');
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    function (response: any) {
        // hideLoading();

        if (response.status === 200) {
            // 成功时不显示消息，只返回数据
            return Promise.resolve(response.data);
        } else {
            // 其他状态码显示错误消息
            ElMessage.error(response.data.msg || '请求失败');
            return Promise.resolve(response.data);
        }
    },
    function (error: any) {
        // hideLoading();

        // 处理不同的错误状态码
        const status = error.response?.status;
        const message = error.response?.data?.msg || error.message;

        switch (status) {
            case 401:
                ElMessage.error('未授权，请重新登录');
                break;
            case 403:
                ElMessage.error('拒绝访问');
                break;
            case 404:
                ElMessage.error('请求的资源不存在');
                break;
            case 500:
                ElMessage.error('服务器内部错误');
                break;
            default:
                ElMessage.error(message || '网络请求失败');
        }

        return Promise.reject(error);
    }
);

mockService.interceptors.response.use(
    function (response: any) {
        // hideLoading();

        if (response.status === 200) {
            // 成功时不显示消息，只返回数据
            return Promise.resolve(response.data);
        } else {
            ElMessage.error(response.data.msg || '请求失败');
            return Promise.resolve(response.data);
        }
    },
    function (error: any) {
        // hideLoading();

        const status = error.response?.status;
        const message = error.response?.data?.msg || error.message;

        switch (status) {
            case 401:
                ElMessage.error('未授权，请重新登录');
                break;
            case 403:
                ElMessage.error('拒绝访问');
                break;
            case 404:
                ElMessage.error('请求的资源不存在');
                break;
            case 500:
                ElMessage.error('服务器内部错误');
                break;
            default:
                ElMessage.error(message || '网络请求失败');
        }

        return Promise.reject(error);
    }
);
export default service;
export { mockService };
