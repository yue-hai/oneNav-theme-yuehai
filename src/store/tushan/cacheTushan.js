// 从 Pinia 库中引入 defineStore 函数，用于创建一个 store
import { defineStore } from 'pinia'

/**
 * 定义一个名为 cacheTushan 的 store
 * 这个 store 将用于管理与用户认证相关的状态和操作
 * cacheTushanStore 是一个 store 的实例，可以通过 useStore('cacheTushanStore') 来获取
 */
export const cacheTushanStore = defineStore('cacheTushan', {
    /**
     * 用于持久化存储状态
     */
    persist: {
        // 启用持久化存储，默认会将 store 中的所有状态持存储在 localstorage 中
        enabled: true,
        // 指定持久化存储的策略
        strategies: [
            {
                // 存储时使用的 key
                key: "cacheTushan",
                /**
                 * 指定持久化存储的方式，可以是 localStorage 或 sessionStorage
                 * - localStorage：数据将持久化存储在浏览器的 localStorage 中，关闭浏览器后数据仍然存在
                 * - sessionStorage：数据将持久化存储在浏览器的 sessionStorage 中，关闭浏览器后数据将被清除
                 */
                storage: localStorage,
            }
        ]
    },
    /**
     * state 是一个函数，返回 store 的初始状态
     * 在这里可以定义所有状态变量
     */
    state: () => {
        return {
            // 选择的搜索引擎，默认为 bing
            cacheSearchEngine: "bing",
            // 点击过的链接列表
            cacheLinkList: [],
            // 历史面板的行数，默认为 2，横向排列
            cacheHistoryPanelRows: 2,
            // 历史面板的列数，默认为 6，纵向排列
            cacheHistoryPanelColumns: 6,
            // 历史面板项的间距，默认为 20px
            cacheHistoryPanelGap: "20px",
        }
    },
    /**
     * actions 是一个对象，其中包含能够修改状态的方法
     * 在这里定义的方法将用来修改相关的状态
     */
    actions: {
        /**
         * 向点击过的链接列表中添加一个链接
         * @param link 要添加的链接
         */
        addCacheLink(link) {
            // 先找一下链接是否存在
            const index = this["cacheLinkList"].findIndex(item => item.url === link.url);
            // 如果已经存在，则把它从原位置删除
            if (index !== -1) this["cacheLinkList"].splice(index, 1);
            // 然后统一将该链接放在数组的最前面
            this["cacheLinkList"].unshift(link);

            // 计算并设置历史面板链接总数量
            this.setTotalLinkCount();
        },
        /**
         * 计算并设置历史面板链接总数量
         */
        setTotalLinkCount() {
            // 计算当前行列数的乘积，即总共应该显示的链接数量
            const totalLinkCount = this["cacheHistoryPanelRows"] * this["cacheHistoryPanelColumns"];
            // 判断缓存中的链接数量是否超过了总共应该显示的链接数量
            if (this["cacheLinkList"].length > totalLinkCount) {
                // 如果超过了，则删除之后所有多余的链接
                this["cacheLinkList"].splice(totalLinkCount);
            }
        }
    },
    /**
     * getters 是一个对象，其中包含能够获取状态的方法
     * 在这里定义的方法将用来获取相关的状态
     */
    getters: {}
});

