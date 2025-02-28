<template>
    <!-- 搜索栏 -->
    <SearchBar :is-navigation-visible="showNavigationList"/>

    <!-- 导航列表动画容器；transition 是 Vue 提供的过渡动画组件 -->
    <transition name="fade-up">
        <!-- 导航列表容器 -->
        <div class="nav-list-wrapper" v-show="showNavigationList">
            <!-- 导航列表 -->
            <NavigationList/>
        </div>
    </transition>

    <!-- 版权信息 -->
    <span class="copyright-info" v-show="!showNavigationList">
        <!-- 版权信息内容 -->
        © {{ new Date().getFullYear() }} Powered by
        <!-- OneNav 项目地址 -->
        <a class="onenav-github" href="https://github.com/helloxz/onenav" target="_blank" title="OneNav 项目地址">OneNav</a>
        <!-- 箭头图标 -->
        <i class="copyright-info-arrow fa fa-long-arrow-right"></i>
        <!-- 后台管理地址 -->
        <a class="onenav-backstage" :href="`${serverConfigStore().apiBaseUrl}/index.php?c=admin`" target="_blank" title="OneNav 后台管理地址">log in</a>
    </span>

    <!-- 历史面板；放到最后的原因是不占用导航列表的空间，使导航列表的高度不受影响 -->
    <HistoryPanel class="history-panel" :is-navigation-visible="showNavigationList"/>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    import { ref, onMounted, onBeforeUnmount, provide } from 'vue'
    // 引入 serverConfig 仓库，用于获取服务器配置
    import { serverConfigStore } from "@/store/serverConfig.js";


    /**
     * 此处代码块用于引入组件
     */
    // 引入 SearchBar 搜索栏组件
    import SearchBar from '@/views/tushan/SearchBar.vue'
    // 引入 NavigationList 导航列表组件
    import NavigationList from '@/views/tushan/NavigationList.vue'
    // 引入 HistoryPanel 历史面板组件
    import HistoryPanel from '@/views/tushan/HistoryPanel.vue'


    /**
     * 此处代码块用于定义导航列表组件的显示和隐藏逻辑
     */
    // 控制导航列表是否显示
    const showNavigationList = ref(false)
    /**
     * 监听鼠标滚轮事件，控制导航列表的显示；隐藏事件由子组件触发
     * @param event - 鼠标滚轮事件
     */
    const handleScroll = (event) => {
        // 获取滚轮滚动的方向
        const deltaY = event.deltaY;

        // 判断滚轮滚动的方向；deltaY > 0 为向下滚动，< 0 为向上滚动
        if (deltaY > 0) {
            // 向下滚动时，显示 NavigationList，并重置顶部标志
            showNavigationList.value = true;
        }
    }
    /**
     * 监听点击事件，控制导航列表的显示和隐藏
     * @param event - 鼠标点击事件
     */
    const handleClick = (event) => {
        // 如果导航列表不显示，则不执行后续操作
        if (!showNavigationList.value) return

        // 获取导航列表容器
        const navigationListWrapper = document.querySelector('.nav-list-wrapper')
        // 如果导航列表容器存在，且点击的不是导航列表容器内部元素
        if (navigationListWrapper && !navigationListWrapper.contains(event.target)) {
            // 隐藏导航列表
            showNavigationList.value = false
        }
    }
    // 组件挂载时添加监听滚动和点击事件
    onMounted(() => {
        window.addEventListener('wheel', handleScroll, { passive: true })
        window.addEventListener('click', handleClick)
    })
    // 组件销毁时移除监听滚动和点击事件
    onBeforeUnmount(() => {
        window.removeEventListener('wheel', handleScroll)
        window.removeEventListener('click', handleClick)
    })
    /**
     * 使用 provide 提供方法和数据给子组件调用
     */
    provide('showNavigationList', { showNavigationList });
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
        height: 75vh; // 高度占据屏幕的 75%
        background: rgba(255, 255, 255, 0.1); // 半透明背景
        backdrop-filter: blur(5px); // 毛玻璃效果
        box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2); // 底部阴影
        border-radius: 20px 20px 0 0; // 圆角：左上、右上
        z-index: 999; // 设置 z-index 为 999，确保在其他元素之上
    }

    // 版权信息样式
    .copyright-info {
        position: fixed; // fixed：固定定位，相对于浏览器窗口定位
        bottom: 8px; // 距离底部 8px
        left: 50%; // 距离左侧 50%，即水平居中
        transform: translateX(-50%); // 水平居中
        color: rgba(255, 255, 255, 0.5); // 半透明白色
        font-size: 13px; // 字体大小 13px
        font-weight: 500; // 字体粗细 500
        text-align: center; // 文本居中

        // 版权信息链接样式
        .onenav-github, .onenav-backstage {
            color: inherit; // 继承父级颜色
            text-decoration: none; // 移除链接下划线
        }
        // 版权信息链接悬停样式
        .onenav-github:hover, .onenav-backstage:hover {
            color: brown; // 悬停时字体颜色变为棕色
        }

        // 版权信息内容的箭头样式
        .copyright-info-arrow {
            padding: 0 5px; // 左右内边距 5px，和文字之间留出一定的间距
        }
    }
}
</style>
