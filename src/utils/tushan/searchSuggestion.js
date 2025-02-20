/**
 * 搜索建议工具，提供了百度、Bing、Google 三大搜索引擎的搜索建议功能
 * 使用 JSONP 方式跨域获取搜索建议数据
 * fetchSuggestions: 获取搜索建议的主函数
 * cleanupSuggestions: 清理资源的函数
 */
export{
    fetchSuggestions,
    cleanupSuggestions
}

/**
 * 防抖函数：用于限制函数的调用频率
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 经过防抖处理的函数
 */
const debounce = (fn, delay) => {
    // 定义定时器变量
    let timer = null;
    // 返回新的函数
    return function(...args) {
        // 如果已经存在定时器，则清除定时器
        if (timer) clearTimeout(timer);
        // 设置新的定时器
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

/**
 * 主要的搜索建议函数
 * @param {Array} suggestions - Vue 的响应式数组，用于存储搜索建议
 * @param {Object} currentEngine - 当前选中的搜索引擎
 * @param {string} keyword - 搜索关键词
 */
const fetchSuggestions = debounce((suggestions, currentEngine, keyword) => {
    // 如果关键词为空，清空建议列表并返回
    if (!keyword) {
        suggestions.value = [];
        return;
    }

    /**
     * 处理搜索建议的回调函数
     * @param {Array} results - 搜索建议结果数组
     */
    const handleSuggestions = (results) => {
        suggestions.value = results;
    };

    // 根据当前搜索引擎选择对应的搜索建议实现
    switch (currentEngine.value.name.toLowerCase()) {
        case 'bing':
            bingSuggestions(keyword, handleSuggestions);
            break;
        case 'google':
            googleSuggestions(keyword, handleSuggestions);
            break;
        case 'baidu':
            baiduSuggestions(keyword, handleSuggestions);
            break;
        default:
            // 默认使用百度搜索建议
            baiduSuggestions(keyword, handleSuggestions);
    }
}, 200); // 200ms 的防抖延迟

/**
 * 清理旧的 JSONP script 标签
 * @param {string} id - script 标签的 id
 */
const cleanOldScript = (id) => {
    // 查找指定 id 的 script 标签
    const oldScript = document.getElementById(id);
    // 如果存在则从 DOM 中移除
    if (oldScript) {
        document.body.removeChild(oldScript);
    }
};

/**
 * Bing 搜索建议实现
 * @param {string} keyword - 搜索关键词
 * @param {Function} callback - 处理搜索建议的回调函数
 */
const bingSuggestions = (keyword, callback) => {
    // 定义 JSONP 回调函数名
    const callbackName = 'bingSuggestionCallback';
    // 在全局作用域中定义回调函数
    window[callbackName] = (data) => {
        // 使用可选链操作符安全地访问嵌套属性
        if (data["AS"]["Results"][0]["Suggests"]) {
            // 将建议数据转换为纯文本数组
            const suggestions = data["AS"]["Results"][0]["Suggests"].map(item => item["Txt"]);
            callback(suggestions);
        }
    };

    // 清理旧的 script 标签
    cleanOldScript('bingSuggestionScript');
    // 创建新的 script 标签
    const script = document.createElement('script');
    // 设置 script 标签的 id
    script.id = 'bingSuggestionScript';
    // 设置请求 URL，包含关键词和回调函数名
    script.src = `https://api.bing.com/qsonhs.aspx?type=cb&q=${encodeURIComponent(keyword)}&cb=${callbackName}`;
    // 将 script 标签添加到文档中
    document.body.appendChild(script);
};

/**
 * Google 搜索建议实现
 * @param {string} keyword - 搜索关键词
 * @param {Function} callback - 处理搜索建议的回调函数
 */
const googleSuggestions = (keyword, callback) => {
    // 定义 JSONP 回调函数名
    const callbackName = 'googleSuggestionCallback';
    // 在全局作用域中定义回调函数
    window[callbackName] = (data) => {
        // 检查返回数据的格式是否正确
        if (data && Array.isArray(data[1])) {
            callback(data[1]);
        }
    };

    // 清理旧的 script 标签
    cleanOldScript('googleSuggestionScript');
    // 创建新的 script 标签
    const script = document.createElement('script');
    // 设置 script 标签的 id
    script.id = 'googleSuggestionScript';
    // 设置请求 URL，包含关键词和回调函数名
    script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(keyword)}&jsonp=${callbackName}`;
    // 将 script 标签添加到文档中
    document.body.appendChild(script);
};

/**
 * 百度搜索建议实现
 * @param {string} keyword - 搜索关键词
 * @param {Function} callback - 处理搜索建议的回调函数
 */
const baiduSuggestions = (keyword, callback) => {
    // 定义 JSONP 回调函数名
    const callbackName = 'baiduSuggestionCallback';
    // 在全局作用域中定义回调函数
    window[callbackName] = (data) => {
        // 如果返回数据中包含建议列表，则调用回调函数
        if (data && data.s) {
            callback(data.s);
        }
    };

    // 清理旧的 script 标签
    cleanOldScript('baiduSuggestionScript');
    // 创建新的 script 标签
    const script = document.createElement('script');
    // 设置 script 标签的 id
    script.id = 'baiduSuggestionScript';
    // 设置请求 URL，包含关键词和回调函数名
    script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(keyword)}&cb=${callbackName}`;
    // 将 script 标签添加到文档中
    document.body.appendChild(script);
};

/**
 * 清理函数：用于组件卸载时清理资源，清理全局回调函数和 script 标签
 */
const cleanupSuggestions = () => {
    // 清理所有全局回调函数
    delete window.baiduSuggestionCallback;
    delete window.bingSuggestionCallback;
    delete window.googleSuggestionCallback;

    // 清理所有 script 标签
    cleanOldScript('baiduSuggestionScript');
    cleanOldScript('bingSuggestionScript');
    cleanOldScript('googleSuggestionScript');
};
