// 从 axios 库导入 axios，用于进行 HTTP 请求
import axios from 'axios'

/**
 * export：模块对外暴露的接口；统一暴露
 */
export{
    fetchSuggestions,
}

/**
 * 获取搜索建议
 * @param suggestions 搜索建议列表，ref 对象
 * @param currentEngine 当前搜索引擎，ref 对象
 * @param query 搜索关键词
 * @returns {Promise<void>}
 */
const fetchSuggestions = async (suggestions, currentEngine, query) => {
    if (!query.trim()) {
        suggestions.value = []
        return
    }

    // 判断当前搜索引擎是是什么，根据不同的搜索引擎，发送不同的请求
    try {
        // 发送请求，获取搜索建议
        const response = await axios.get(`${currentEngine.value.suggestionUrl}${query}`, {
            // 设置响应类型为文本
            responseType: 'text'
        });

        // 判断当前搜索引擎是什么，根据不同的搜索引擎，解析不同的搜索建议
        switch (currentEngine.value.name) {
            case 'bing':
                suggestions.value = fetchBingSuggestions(response)
                break
            case 'google':
                suggestions.value = fetchGoogleSuggestions(response)
                break
            case 'baidu':
            case 'sogou':
            case '360':
                suggestions.value = fetchBaiduSuggestions(response)
                break
        }
    } catch (error) {
        suggestions.value = []
    }
}

/**
 * 获取必应搜索建议
 * @param response 请求响应
 */
const fetchBingSuggestions = (response) => {
    // 将 response 转为 JSON 对象
    const jsonData = JSON.parse(response.data);
    // 判断 FullResults 是否不为 0
    if (jsonData["AS"]["FullResults"] === 0) return ["暂无搜索建议"];

    // 获取返回值中的搜索建议列表
    let responseList = jsonData["AS"]["Results"][0]["Suggests"];
    // 判断搜索建议列表是否为空，为空则返回默认值
    if (!responseList) return ["暂无搜索建议"];

    // 创建搜索建议列表
    let suggestions = responseList.map(item => item["Txt"]);
    // 返回搜索建议列表
    return suggestions.length === 0 ? ["暂无搜索建议"] : suggestions;
}

/**
 * 获取谷歌搜索建议
 * @param response 请求响应
 */
const fetchGoogleSuggestions = (response) => {
    // 将 response 转为 JSON 对象
    const jsonData = JSON.parse(response.data);
    // 返回搜索建议列表
    return jsonData[1].length === 0 ? ["暂无搜索建议"] : jsonData[1];
}

/**
 * 获取百度搜索建议
 * @param response 请求响应
 */
const fetchBaiduSuggestions = (response) => {
    // 提取 JSONP 里的 JSON 数据
    const matches = response.data.match(/window\.baidu\.sug\((.*)\)/);
    if (!matches && !matches[1]) return [];

    // 直接执行 JavaScript 代码，获取对象
    const jsonData = new Function("return " + matches[1])();
    // 判断是否解析成功
    if (jsonData && jsonData.s) {
        return jsonData.s.length === 0 ? ["暂无搜索建议"] : jsonData.s;
    } else {
        return [];
    }
}

