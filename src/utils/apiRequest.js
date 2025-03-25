// 从 axios 库导入 axios，用于进行 HTTP 请求
import axios from 'axios'
// 引入 serverConfig 仓库，用于获取 token
import { serverConfigStore } from "@/store/serverConfig.js";
// 引入 popupMethodStore 仓库，用于管理提示弹窗和蒙版弹窗
import { popupMethodStore } from "@/store/popupMethod.js";
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
 * @param url 请求地址
 * @param urlParams URL 参数；默认为空
 * @param handler 额外的请求头；如果传入了额外的请求头，则使用传入的请求头；否则使用默认的请求头
 * @param responseType 响应类型；默认为 json
 */
const getApiRequest = async ({
    url,
    urlParams,
    handler,
    responseType
}) => {
    // 请求开始时，关闭错误提示
    popupMethodStore().closeTipPopup('error-tip');

    try {
        // 发送 get 请求；使用 async/await 语法糖，简化 Promise 的使用，返回响应数据
        return await axios.get(url, {
            // 设置请求参数，传递 URL 参数
            params: urlParams ?? {},
            // 设置请求头，传递验证信息
            headers: handler ?? requestHandler(true, serverConfigStore().token ?? '') ?? undefined,
            // 设置响应类型，传递 responseType
            responseType: responseType ?? 'json'
        });
    } catch (error) {
        // 抛出错误
        throw error;
    }
};

