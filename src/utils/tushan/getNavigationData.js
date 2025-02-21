// 引入 API 请求工具类
import { getApiRequest } from '@/utils/apiRequest.js';


/**
 * 调用 oneNav 接口，获取导航数据
 * getCategoryList：获取分类目录列表
 */
export{
    getCategoryList
}

/**
 * 获取分类目录列表
 * @param homeMethod 父组件传递的方法
 * @param successCallback 请求成功时的回调函数
 */
const getCategoryList = async (homeMethod, successCallback) => {
    // 解构赋值，获取父组件传递的方法
    const { openErrorTip } = homeMethod;

    try {
        // 调用获取分类目录列表的 API
        const response = await getApiRequest({
            homeMethod: homeMethod,
            url: `/index.php`,
            urlParams: {c: "api", method: "category_list", page: "1", limit: "99999"},
        });
        // 调用获取链接列表
        await getLinkList(homeMethod, response.data, successCallback);
    } catch {
        // 如果请求失败，打印错误信息
        console.log("获取分类目录数据失败");
        // 显示错误提示
        openErrorTip({
            text: "获取分类目录数据失败",
            tooltip: "获取分类目录数据失败，可能是未登录或接口出错，若已登录请检查 nginx 设置",
            closeCountdown: 5
        });
    }
}

/**
 * 查询指定分类下的链接列表
 * @param homeMethod 父组件传递的方法
 * @param categoryList 分类目录列表
 * @param successCallback 请求成功时的回调函数
 */
const getLinkList = async (homeMethod, categoryList, successCallback) => {
    // 解构赋值，获取父组件传递的方法
    const { openErrorTip } = homeMethod;

    /**
     * 使用 Promise.all 和 map 方法并行处理所有分类的链接请求
     * map 方法为每个分类创建一个异步请求任务
     * Promise.all 等待所有请求完成后才继续执行
     */
    const promises = categoryList.map(async (category) => {
        try {
            // 为每个分类发起异步请求，获取该分类下的所有链接
            const response = await getApiRequest({
                homeMethod: homeMethod,
                url: `/index.php`,
                urlParams: { c: "api", method: "q_category_link", category_id: `${category.id}`, page: "1", limit: "99999" },
            });
            // 将获取到的链接列表保存到对应的分类对象中
            category.link_list = response.data;
        } catch (error) {
            // 如果请求失败，打印错误信息
            console.log(`${category.name} 分类下的链接列表获取失败：`, error);
            // 显示错误提示
            openErrorTip({
                text: `${category.name} 目录获取失败：`,
                tooltip: `获取获取 ${category.name} 下的链接列表失败，可能是未登录或接口出错，若已登录请检查 nginx 设置`,
                closeCountdown: 5
            });
        }
    });
    // Promise.all 确保所有请求都完成后才继续执行
    await Promise.all(promises);
    // 调用成功回调函数，通知父组件数据获取完成
    successCallback();
}

