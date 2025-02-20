/**
 * export：模块对外暴露的接口；统一暴露
 * requestHandler：请求处理工具，用于处理发送请求时的各种操作
 */
export {
    requestHandler,
}

/**
 * 根据是否需要验证，返回不同请求头
 * @param {boolean} needAuth 是否需要验证
 * @param {string} token token 值
 * @param {Object} extraHeaders 额外的请求头
 * @return {Object} 请求头
 */
const requestHandler = (needAuth, token, extraHeaders = {}) => {
    // 基本请求头设置，返回配置对象
    return {
        // 如果需要验证，则添加 token 到请求头；否则不添加
        "token": needAuth ? token : "",
        // 将额外的请求头添加到请求头中
        ...extraHeaders
    };
}
