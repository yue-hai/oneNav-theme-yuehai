<template>

</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 navigationData 仓库，用于读取导航数据
    import { navigationDataStore } from "@/store/navigationData.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { navigationDataList } = storeToRefs(navigationDataStore());



</script>

<style scoped lang="less">

</style>
