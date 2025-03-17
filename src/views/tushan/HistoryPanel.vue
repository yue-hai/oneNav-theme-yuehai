<template>
    <!-- 历史面板 -->
    <div class="history-panel" :class="{ 'search-move-up': isNavigationVisible }">
        <!-- 历史容器 -->
        <div class="history-container">
            <!-- 遍历历史链接列表 -->
            <LinkItem v-for="link in cacheLinkList" :key="link.id" :link="link"/>
        </div>

        <!-- 编辑按钮 -->
        <div class="edit-button">
            <HoverButton :button="{ title: '编辑', image: editIcon }" />
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
    const { cacheLinkList, cacheHistoryPanelColumns, cacheHistoryPanelRows, cacheHistoryPanelGap } = storeToRefs(cacheTushanStore());


    /**
     * 此处代码块用于引入组件和图标
     */
    // 引入 LinkItem 链接项组件
    import LinkItem from "@/components/tushan/LinkItem.vue";
    // 引入 HoverButton 悬停按钮组件
    import HoverButton from "@/components/common/HoverButton.vue";
    // 引入编辑图标
    import editIcon from "@/assets/images/tushan/historyPanel/编辑.svg";
</script>

<style scoped lang="less">
// 历史面板样式
.history-panel {
    position: relative; // 设置定位为相对定位，方便内部元素和伪元素定位
    width: 100%; // 宽度占满父容器
    margin: 30px 0; // 上下边距 30px
    user-select: none; // 不可复制
    transition: transform 0.4s ease, opacity 0.4s ease; // 透明度 + 移动动画

    // 历史容器
    .history-container {
        width: fit-content; // 让容器宽度适应网格项内容，而不会自动扩展
        max-width: 100%; // 避免超出父容器
        margin: 0 auto; // 让整个 grid 居中
        display: grid; // 使用网格布局
        grid-template-columns: repeat(v-bind(cacheHistoryPanelColumns), 1fr); // 设置列数，绑定动态列数，每列宽度相等
        grid-template-rows: repeat(v-bind(cacheHistoryPanelRows), auto);// 设置行数，绑定动态行数，每行高度自适应
        place-items: center; // 网格布局的垂直水平居中
        gap: v-bind(cacheHistoryPanelGap); // 设置间距，绑定动态 gap
    }

    // 编辑按钮
    .edit-button {
        position: absolute; // 设置定位为绝对定位
        top: 50%;  // 顶部 50%
        left: 50%; // 左侧 50%
        transform: translate(-50%, -50%); // 通过 transform 位移自身 50% 达到居中效果
        opacity: 0; // 初始隐藏
        visibility: hidden; // 避免占据空间
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out; // 添加过渡动画

        // 覆盖编辑按钮容器尺寸
        ::v-deep(.button-container) {
            width: 35px; // 宽度 35px
            height: 35px; // 高度 35px
            margin-top: 5px; // 上边距 5px
        }
    }

    // 当鼠标悬停到历史面板上时，显示编辑按钮
    &:hover .edit-button {
        opacity: 1; // 完全显示
        visibility: visible; // 让其可见
    }
}

// 当导航列表显示时，搜索栏上移 5vh
.search-move-up {
    transform: translateY(-10vh); // 让历史面板向上移动 10vh，和搜索栏保持一致
    opacity: 0; // 渐渐隐藏
    pointer-events: none; // 禁用所有子元素交互
}
</style>
