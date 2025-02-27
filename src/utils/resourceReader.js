/**
 * export：模块对外暴露的接口；统一暴露
 * readImage：资源读取工具，用于读取资源文件
 */
export{
    readImage,
}

/**
 * 分割路径，获取子路径和具体路径
 */
const splitPath = (path) => {
    // 获取路径中最开始的 / 的索引
    const index = path.indexOf('/');
    // 判断路径中是否包含 /
    if (index !== -1) {
        // 获取子目录名称
        const startPath = path.substring(0, index);
        // 获取子目录下的具体路径名称
        const otherPath = path.substring(index + 1);
        // 返回子目录名称和具体路径名称
        return [startPath, otherPath];
    } else {
        // 路径中不包含 /，直接返回路径
        return [path];
    }
}

/**
 * resourceReader：资源读取工具，用于读取资源文件
 * 获取图片资源，通过这种方式引用的资源文件，vite 才会将其打包到 dist 目录
 * 在 vite6 中，new URL() 在解析路径时动态部分不支持多层级目录，即：
 *  - path = 'xxx.png' 可以解析
 *  - path = 'tushan/searchBar/xxx.png' 无法解析
 * @param path 图片路径
 * @returns {string} 图片资源路径
 */
const readImage = (path) => {
    // 分割路径
    let pathList = splitPath(path);
    // 判断路径列表的长度是否大于 1
    if (pathList.length > 1) {
        // 获取子目录名称
        const startPath = pathList[0];
        // 获取子目录下的具体路径名称
        const otherPath = pathList[1];
        // 判断子目录名称
        switch (startPath) {
            // 读取 tushan 目录下的图片资源
            case 'tushan':
                return getTushanUrl(otherPath);
            // 可以在这里不断添加新的子目录
        }
    } else {
        /**
         * 路径中不包含 /，直接返回图片资源路径
         * new URL() 方法用于创建一个新的 URL 对象，该对象表示指定的绝对或相对 URL
         * import.meta.url 属性返回当前模块的绝对 URL，模块是指当前文件
         * href 属性返回完整的 URL，包括主机名、端口号、路径等
         * 通过 new URL() 方法将图片路径转换为绝对路径，然后返回
         */
        return new URL(`../assets/images/${path}`, import.meta.url).href;
    }
};

/**
 * 读取 tushan 目录下的图片资源
 */
const getTushanUrl = (path) => {
    // 分割路径
    let pathList = splitPath(path);
    // 判断路径列表的长度是否大于 1
    if (pathList.length > 1) {
        // 获取子目录名称
        const startPath = pathList[0];
        // 获取子目录下的具体路径名称
        const otherPath = pathList[1];
        // 判断子目录名称
        switch (startPath) {
            // 读取 tushan/searchBar 目录下的图片资源
            case 'searchBar':
                return new URL(`../assets/images/tushan/searchBar/${otherPath}`, import.meta.url).href;
            // 读取 tushan/link 目录下的图片资源
            case 'link':
                return new URL(`../assets/images/tushan/link/${otherPath}`, import.meta.url).href;
            // 可以在这里不断添加新的子目录
        }
    } else {
        // 路径中不包含 /，直接返回图片资源路径
        return new URL(`../assets/images/tushan/${path}`, import.meta.url).href;
    }
};
