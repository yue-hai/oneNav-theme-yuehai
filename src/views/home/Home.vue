<template>
    <!-- 添加 router-view 来渲染子路由内容 -->
    <router-view />
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue-router 的路由 API
    import { useRouter } from 'vue-router'
    // 创建 useRoute 实例
    const router = useRouter()


    /**
     * 此处代码块用于页面跳转
     */
    // 页面加载完毕后，跳转到 tushan 首页
    router.push('/tushan')
</script>
