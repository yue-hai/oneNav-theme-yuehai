<template>
    <!-- 导航列表组件 -->
    <div class="navigation-list">
        <!-- 遍历导航分类数据，使用 Drawer 组件展示分类抽屉 -->
        <div class="category-container">
            <div class="drawer-list" v-for="navigationData in navigationDataList" :key="navigationData.id">
                <Drawer :category="navigationData" />
            </div>
        </div>

        <LinkList />
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    import { onMounted, onBeforeUnmount } from 'vue'
    // 接收父组件传递的参数
    const { updateShowNavigationList } = defineProps(['updateShowNavigationList']);
    // 引入 navigationData 仓库，用于读取导航数据
    import { navigationDataStore } from "@/store/navigationData.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { navigationDataList } = storeToRefs(navigationDataStore());


    /**
     * 此处代码块用于引入组件
     */
    // 引入 Drawer 分类抽屉组件
    import Drawer from '@/components/tushan/Drawer.vue';
    // 引入 LinkList 链接列表组件
    import LinkList from "@/views/tushan/LinkList.vue";


    /**
     * 此处代码块用于监听滚动事件，控制导航列表组件的显示和隐藏逻辑
     */
    // 监听鼠标滚轮事件，控制导航列表的显示
    const handleScroll = (event) => {
        // 获取滚轮滚动的方向
        const deltaY = event.deltaY;
        // 获取导航列表容器
        const navListWrapper = document.querySelector('.category-container');
        // 如果导航列表容器不存在，则不执行后续操作
        if (!navListWrapper) return;

        // 获取导航列表容器的滚动距离；scrollTop 为 0 时表示已经滚动到顶部，否则表示未到顶部
        const scrollTop = navListWrapper.scrollTop;
        // 判断滚轮滚动的方向；deltaY > 0 为向下滚动，< 0 为向上滚动
        if (deltaY < 0 && scrollTop === 0) {
            // 向上滚动时 且 滚动到顶部时，隐藏导航列表
            updateShowNavigationList(false);
        }
    }
    // 组件挂载时添加监听滚动事件
    onMounted(() => {
        window.addEventListener('wheel', handleScroll)
    })
    // 组件销毁时移除监听事件
    onBeforeUnmount(() => {
        window.removeEventListener('wheel', handleScroll)
    })
</script>

<style scoped lang="less">
.navigation-list {
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    height: 100%; // 高度占满整个页面
    overflow: hidden; // 隐藏溢出内容

    // 导航分类容器样式
    .category-container {
        width: 200px; // 宽度 200px
        height: 100%;// 高度占满整个页面
        padding: 10px 0; // 上下内边距 10px，左右内边距 0
        background: rgba(255, 255, 255, 0.1); // 半透明背景
        user-select: none; // 不可复制

        overflow-y: auto; /* 启用滚动 */
        overflow-x: hidden;
        overscroll-behavior: contain; /* 防止滚动穿透 */

        /* 自定义滚动条 */
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
        }

        // 给最后一个分类容器增加下外边距，避免底部内容被遮挡
        .drawer-list:last-child {
            margin-bottom: 15px;
        }
    }
}
</style>
