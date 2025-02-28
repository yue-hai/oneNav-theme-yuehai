<template>
    <!-- 历史面板 -->
    <div class="history-panel" :class="{ 'search-move-up': isNavigationVisible }">
        <!-- 历史容器 -->
        <div class="history-container">
            <!-- 遍历历史链接列表 -->
            <LinkItem v-for="link in cacheLinkList" :key="link.id" :link="link"/>
        </div>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 接收父组件传递的参数
    const { isNavigationVisible } = defineProps(['isNavigationVisible']);
    // 引入 cacheTushanStore 仓库，用于读取和保存用户设置
    import { cacheTushanStore } from "@/store/tushan/cacheTushan.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { cacheLinkList } = storeToRefs(cacheTushanStore());


    /**
     * 此处代码块用于引入组件
     */
    // 引入 LinkItem 链接项组件
    import LinkItem from "@/components/tushan/LinkItem.vue";
</script>

<style scoped lang="less">
// 历史面板样式
.history-panel {
    position: relative; // 设置定位为相对定位，方便内部元素和伪元素定位
    width: 100%; // 宽度占满父容器
    max-width: 600px; // 最大宽度 600px
    margin: 30px auto 0; // 上边距 20vh，左右居中
    user-select: none; // 不可复制
    transition: transform 0.4s ease, opacity 0.4s ease; // 透明度 + 移动动画

    // 历史容器
    .history-container {
        max-width: 100%; // 避免超出父容器
        display: grid; // 使用网格布局
        grid-template-columns: repeat(5, 1fr); // 定义 5 列
        grid-template-rows: repeat(2, auto); // 定义 2 行
        place-items: center; // 网格布局的垂直水平居中
        gap: 20px; // 设置间距
    }
}

// 当导航列表显示时，SearchBar 上移 5vh
.search-move-up {
    // 让 SearchBar 向上移动 10vh，和 SearchBar 搜索框保持一致
    transform: translateY(-10vh);
    opacity: 0; // **渐渐隐藏**
}
// 当历史面板隐藏时，设置为不可见
.history-panel.hidden {
    visibility: hidden; // 在动画结束后才隐藏
}
</style>
