/**
 * export：模块对外暴露的接口；统一暴露
 * parseNumber：尝试将字符串转换为数字，如果出错则使用默认值
 * parseGap：将用户输入的间距统一转换为 "{number}px" 的字符串形式
 */
export {
    parseNumber,
    parseGap
}

/**
 * 判断值是否为空（undefined、null、空字符串）
 * @param {any} val
 * @returns {boolean}
 */
function isEmpty(val) {
    return val === undefined || val === null || val === '';
}

/**
 * 尝试将字符串转换为数字，如果出错则使用默认值。
 * @param {any} val 用户输入的字符串
 * @param {number} defaultVal 转换失败时使用的默认值
 * @returns {number} 返回一个有效数字
 */
function parseNumber(val, defaultVal) {
    // 如果输入为空，则使用默认值
    if (isEmpty(val)) return defaultVal;

    // 转成浮点数
    const num = parseFloat(val);
    // 判断是否转换成功
    if (isNaN(num)) {
        // 如果转换失败，打印警告信息，并使用默认值
        console.warn(`无法将 ${val} 解析为数字，使用默认值 ${defaultVal}`);
        return defaultVal;
    }
    return num;
}

/**
 * 将用户输入的间距统一转换为 "{number}px" 的字符串形式。
 * @param {string} gapStr 用户输入的间距，可以是纯数字、带 px、或带空格等
 * @param {string} defaultVal 转换失败时使用的默认值
 * @returns {string} 返回格式化后的间距，比如 "10px", "5.5px" 等
 * @throws 当输入不合法时抛出错误
 */
function parseGap(gapStr, defaultVal) {
    // 如果输入为空，则使用默认值
    if (isEmpty(gapStr)) return defaultVal;

    // 去掉前后空格
    const raw = String(gapStr).trim();

    // 如果是纯数字或纯浮点数，如 10, 5.5，那么直接加上 px
    if (/^\d+(\.\d+)?$/.test(raw)) {
        return raw + 'px';
    }

    // 如果是数字 + px，如 10px, 5.5px，则认为它是合法的
    if (/^\d+(\.\d+)?px$/.test(raw)) {
        return raw;
    }

    // 否则视为非法输入，打印警告信息，并使用默认值
    console.warn(`无法将 ${gapStr} 解析为间距，使用默认值 ${defaultVal}`);
    return defaultVal;
}
