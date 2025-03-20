// 引入 API 请求工具类
import { getApiRequest } from '@/utils/apiRequest.js';
// 引入 navigationData 仓库，用于设置导航数据
import { navigationDataStore } from "@/store/navigationData.js";


/**
 * 调用 oneNav 接口，获取导航数据
 * getCategoryList：获取分类目录列表
 */
export{
    getCategoryList
}

/**
 * 获取分类目录列表
 * @param homePopupMethod 父组件传递的方法
 */
const getCategoryList = async (homePopupMethod) => {
    // 解构赋值，获取父组件传递的方法
    const { openPopup } = homePopupMethod;

    try {
        // 调用获取分类目录列表的 API
        const response = await getApiRequest({
            homePopupMethod: homePopupMethod,
            url: `/oneNavApi/index.php`,
            urlParams: {c: "api", method: "category_list", page: "1", limit: "99999"},
        });
        // 调用获取链接列表
        await getLinkList(homePopupMethod, response.data.data);
    } catch {
        // 如果请求失败，打印错误信息
        console.log("获取分类目录数据失败");
        // 显示错误提示
        openPopup("error-tip",
            false,
            {
                text: "获取分类目录数据失败",
                tooltip: "获取分类目录数据失败，可能是未登录或接口出错，若已登录请检查 nginx 设置"
            }
        );
    }
}

/**
 * 查询指定分类下的链接列表
 * @param homePopupMethod 父组件传递的方法
 * @param categoryList 分类目录列表
 */
const getLinkList = async (homePopupMethod, categoryList) => {
    // 解构赋值，获取父组件传递的方法
    const { openPopup } = homePopupMethod;

    /**
     * 使用 Promise.all 和 map 方法并行处理所有分类的链接请求
     * map 方法为每个分类创建一个异步请求任务
     * Promise.all 等待所有请求完成后才继续执行
     */
    const promises = categoryList.map(async (category) => {
        try {
            // 为每个分类发起异步请求，获取该分类下的所有链接
            const response = await getApiRequest({
                homePopupMethod: homePopupMethod,
                url: `/oneNavApi/index.php`,
                urlParams: { c: "api", method: "q_category_link", category_id: `${category.id}`, page: "1", limit: "99999" },
            });
            // 将获取到的链接列表保存到对应的分类对象中
            category.link_list = response.data.data;
        } catch (error) {
            // 如果请求失败，打印错误信息
            console.log(`${category.name} 分类下的链接列表获取失败：`, error);
            // 显示错误提示
            openPopup("error-tip",
                false,
                {
                    text: `${category.name} 目录获取失败：`,
                    tooltip: `获取获取 ${category.name} 下的链接列表失败，可能是未登录或接口出错，若已登录请检查 nginx 设置`
                }
            );
        }
    });

    // Promise.all 确保所有请求都完成后才继续执行
    await Promise.all(promises);
    // 设置子父目录关系
    setParentChild(categoryList);
}

/**
 * 设置子父目录关系
 * @param categoryList 原始的分类目录列表数据，是一个扁平的数组结构
 */
export const setParentChild = (categoryList) => {
    /**
     * 第一次遍历：将扁平数组转换为 Map 结构
     * 1. reduce 方法接收两个参数：累加器函数和初始值 {}
     * 2. map 作为累加器，收集所有分类项
     * 3. 使用 id 作为 key，确保快速查找
     * 4. 展开原对象(...item)，并初始化 children 数组
     */
    const categoryMap = categoryList.reduce((map, item) => {
        map[item.id] = { ...item, children: [] };
        return map;
    }, {});

    /**
     * 第二次遍历：建立父子关系
     * 1. 遍历原始数组
     * 2. 对于每个非根节点(fid !== "0")
     * 3. 通过 fid 快速找到父节点
     * 4. 将当前节点添加到父节点的 children 数组中
     */
    categoryList.forEach((item) => {
        if (item["fid"] !== "0") {
            // 直接通过 Map 获取父节点，O(1) 的时间复杂度
            const parent = categoryMap[item["fid"]];
            // 如果找到父节点，则建立关系
            if (parent) {
                parent.children.push(categoryMap[item.id]);
            }
        }
    });

    /**
     * 构建最终的树形结构，将设置好的导航数据保存到导航数据仓库中
     * 1. filter 筛选出顶级节点(fid === "0")
     * 2. map 转换为 Map 中的增强版对象(包含 children)
     * 3. 得到最终的树形结构数据
     */
    navigationDataStore().navigationDataList = categoryList.filter(item => item["fid"] === "0")
        .map(item => categoryMap[item.id]);
}



