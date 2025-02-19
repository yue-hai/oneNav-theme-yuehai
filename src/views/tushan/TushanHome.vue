<template>
    <SearchBar />
    <!--<NavList />-->
</template>

<script setup>
    /**
     * 此处代码块用于引入组件
     */
    // 引入 SearchBar 搜索栏组件
    import SearchBar from '@/components/tushan/SearchBar.vue'
    // 引入 NavList 导航列表组件
    // import NavList from '@/components/tushan/NavList.vue'
</script>

<style lang="less">
// 全局样式重置
* {
    margin : 0; // 重置外边距，避免默认外边距
    padding : 0; // 重置内边距，避免默认内边距
}

// 确保页面固定大小，并隐藏滚动条
html, body {
    width: 100%;
    height: 100%;
    overflow: hidden; // 隐藏滚动条
}

// 背景动画
body {
    background-image: url('@/assets/images/tushan/背景.png'); // 设置背景图片
    background-size: cover; // 让背景铺满整个屏幕
    background-repeat: no-repeat; // 禁止背景图片重复
    background-position: top center; // 初始位置：顶部对齐
    animation: moveBackground 1s linear forwards; // 2 秒从底部移动到顶部
}

// 定义背景移动动画
@keyframes moveBackground {
    0% {
        background-position: top center; // 初始位置：顶部对齐
    }
    100% {
        background-position: center; // 最终位置：居中对齐
    }
}
</style>
