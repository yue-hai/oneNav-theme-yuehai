<template>
    <!-- 搜索栏 -->
    <SearchBar :is-nav-visible="showNavList"/>

    <!-- 导航列表动画容器；transition 是 Vue 提供的过渡动画组件 -->
    <transition name="fade-up">
        <!-- 导航列表容器 -->
        <div class="nav-list-wrapper" v-show="showNavList">
            <!-- 导航列表 -->
            <NavList />
        </div>
    </transition>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    import { ref, onMounted, onBeforeUnmount } from 'vue'


    /**
     * 此处代码块用于引入组件
     */
    // 引入 SearchBar 搜索栏组件
    import SearchBar from '@/components/tushan/SearchBar.vue'
    // 引入 NavList 导航列表组件
    import NavList from '@/components/tushan/NavList.vue'


    /**
     * 此处代码块用于定义导航列表组件的显示和隐藏逻辑
     */
    // 控制导航列表是否显示
    const showNavList = ref(false)
    // 监听鼠标滚轮事件，控制导航列表的显示和隐藏
    const handleScroll = (event) => {
        // 获取滚轮滚动的方向
        const deltaY = event.deltaY
        // 获取页面滚动的距离
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // 判断滚轮滚动的方向是不是向下
        if (deltaY > 0) {
            // 向下滚动时显示 NavList
            showNavList.value = true
        } else if (deltaY < 0) {
            // 向上滚动，且页面已回到顶部时隐藏 NavList
            if (scrollTop === 0) {
                showNavList.value = false
            }
        }
    }
    // 监听点击事件，控制导航列表的显示和隐藏
    const handleClick = (event) => {
        // 如果导航列表不显示，则不执行后续操作
        if (!showNavList.value) return

        // 获取导航列表容器
        const navListWrapper = document.querySelector('.nav-list-wrapper')
        // 如果导航列表容器存在，且点击的不是导航列表容器内部元素
        if (navListWrapper && !navListWrapper.contains(event.target)) {
            // 隐藏导航列表
            showNavList.value = false
        }
    }
    // 组件挂载时添加监听滚动和点击事件
    onMounted(() => {
        window.addEventListener('wheel', handleScroll)
        window.addEventListener('click', handleClick)
    })
    // 组件销毁时移除监听事件
    onBeforeUnmount(() => {
        window.removeEventListener('wheel', handleScroll)
        window.removeEventListener('click', handleClick)
    })
</script>

<style lang="less">
// 全局样式重置
* {
    margin : 0; // 重置外边距，避免默认外边距
    padding : 0; // 重置内边距，避免默认内边距
}

// 确保页面固定大小，并隐藏滚动条
html {
    width: 100%;
    height: 100%;
    overflow: hidden; // 隐藏滚动条

    // 定义背景移动动画
    @keyframes moveBackground {
        0% {
            background-position: top center; // 初始位置：顶部对齐
        }
        100% {
            background-position: center; // 最终位置：居中对齐
        }
    }

    // 背景动画
    body {
        background-image: url('@/assets/images/tushan/背景.png'); // 设置背景图片
        background-size: cover; // 让背景铺满整个屏幕
        background-repeat: no-repeat; // 禁止背景图片重复
        background-position: top center; // 初始位置：顶部对齐
        animation: moveBackground 1s linear forwards; // 2 秒从底部移动到顶部
    }

    // 导航列表动画：进入和离开时的过渡动画
    .fade-up-enter-active, .fade-up-leave-active {
        // 属性在 0.4 秒内从初始值过渡到结束值，缓动效果为 ease，即匀速缓动
        transition: transform 0.4s ease, opacity 0.4s ease;
    }
    // 导航列表动画：进入开始前的状态（即组件刚开始进入时的初始状态）
    .fade-up-enter-from, .fade-up-leave-to {
        // translateY(100%) 使组件从屏幕底部开始，完全不可见
        transform: translateY(100%);
        // opacity: 0 让组件完全透明
        opacity: 0;
    }
    // 导航列表动画：进入结束后的状态（即组件完全进入后）
    .fade-up-enter-to, .fade-up-leave-from {
        // translateY(0) 让组件回到正常位置
        transform: translateY(0);
        // opacity: 1 让组件完全显示
        opacity: 1;
    }

    // 导航列表容器样式
    .nav-list-wrapper {
        position: fixed; // fixed：固定定位，相对于浏览器窗口定位
        width: 100%; // 宽度占满整个屏幕
        height: 66vh; // 高度占据屏幕的 66%，即 2/3
        bottom: 0; // 底部对齐
        left: 0; // 左侧对齐
        padding: 20px; // 内边距 20px
        background: rgba(255, 255, 255, 0.1); // 半透明背景
        backdrop-filter: blur(5px); // 毛玻璃效果
        box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2); // 底部阴影
        border-radius: 20px 20px 0 0; // 圆角：左上、右上
        z-index: 999; // 设置 z-index 为 999，确保在其他元素之上
    }
}
</style>
