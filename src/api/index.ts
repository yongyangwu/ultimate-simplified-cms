import axios from "axios";
// 是否开启本地mock
// const MOCK_FLAG = import.meta.env.VITE_APP_OPEN_MOCK === "true";
// 创建axios实例
const service = axios.create({
    baseURL: "/api"
});
// 请求拦截器
service.interceptors.request.use(
    function (config: any) {
        // 发送请求之前做什么
        // 获取token鉴权

        return config;
    },
    function (error: any) {
        // 请求错误
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    function (response: any) {
        console.log('response', response)
        if (response.status === 200) {
            console.log(response.data.msg)
            return Promise.resolve(response.data);
        } else {
            alert(response.data.msg)
            return Promise.resolve(response.data);
        }
    },
    function (error: any) {
        return Promise.reject(error);
    }
);
export default service;
