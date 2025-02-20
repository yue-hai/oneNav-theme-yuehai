// 从 axios 库导入 axios，用于进行 HTTP 请求
import axios from 'axios'
// 引入 serverConfig 仓库，用于获取 token
import { serverConfig } from "@/store/serverConfig.js";
// 引入请求处理工具
import { requestHandler } from '@/utils/requestHandler.js';

/**
 * export：模块对外暴露的接口；统一暴露
 * commonAPiCall：调用通用 API
 */
export {
    getApiRequest,
}

/**
 * 调用通用 API 工具方法
 * @param homeMethod 父组件传递的方法
 * @param url 请求地址
 * @param urlParams URL 参数；默认为空
 * @param handler 额外的请求头
 * @param successCallback 请求成功时的回调函数
 * @param errorCallback 请求失败时的回调函数
 */
const getApiRequest = async ({
    homeMethod,
    url,
    urlParams,
    handler,
    successCallback,
    errorCallback
}) => {
    // 解构赋值，获取父组件传递的方法
    const { closeErrorTip } = homeMethod;
    // 请求开始时，关闭错误提示
    closeErrorTip();

    // 如果 handler 传入了额外的请求头，则使用传入的请求头；否则使用默认的请求头
    handler = handler ? handler : requestHandler(true, serverConfig().token);
    // 如果 urlParams 传入了额外的 URL 参数，则使用传入的 URL 参数；否则使用默认的 URL 参数
    urlParams = urlParams ? urlParams : {};

    // 发送 get 请求
    axios.get(`/oneNavApi${url}`, {
        // 设置请求头，传递验证信息
        headers: handler,
        // 设置请求参数，传递 URL 参数
        params: urlParams
    }).then((response) => {
        // 调用回调函数
        successCallback(response);
    }).catch((error) => {
        // 如果请求失败，则调用父组件的错误提示方法
        errorCallback(error);
    });
};

