<template>
    <!-- 单个链接项 -->
    <a class="link-item" :href="link.url" target="_blank" :title="link.title" @click.stop="handleClickLink(link)">
        <!-- 链接图标容器-->
        <div class="link-icon-content">
            <!-- 链接图标，当获取到了网站图标时，使用网站图标；当没有获取到网站图标时，使用默认图标 -->
            <img
                class="link-icon"
                :src="linkIconList[link.id] || linkEarthIcon"
                :alt="link.title"
            />
        </div>
        <!-- 链接名称 -->
        <span class="link-name">{{ link.title }}</span>
    </a>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { inject, toRefs } from 'vue'
    // 使用 inject 接收父组件使用 provide 提供的方法和数据
    const { showNavigationList } = inject('showNavigationList');
    // 接收父组件传递的参数
    const props = defineProps(['link']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { link } = toRefs(props);
    // 引入 navigationData 仓库，用于读取导航数据
    import { navigationDataStore } from "@/store/navigationData.js";
    // 引入 cacheTushanStore 仓库，用于读取和保存用户设置
    import { cacheTushanStore } from "@/store/tushan/cacheTushan.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { linkIconList } = storeToRefs(navigationDataStore());


    /**
     * 此处代码块用于引入组件和图标
     */
    // 引入链接地球图标
    import linkEarthIcon from '@/assets/images/tushan/link/链接地球.svg';


    /**
     * 此处代码块用于定义点击链接的事件处理逻辑
     */
    /**
     * 点击链接时，将链接添加到缓存中
     */
    const handleClickLink = (link) => {
        // 将链接添加到点击过的链接列表中
        cacheTushanStore().addCacheLink(link);

        // 关闭导航列表
        showNavigationList.value = false;
    };
</script>

<style scoped lang="less">
// 单个链接项
.link-item {
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    width: 80px; // 设置宽度
    flex-direction: column; // 设置主轴方向为垂直方向
    align-items: center; // 垂直居中
    text-decoration: none; // 移除链接下划线

    // 圆形图标容器
    .link-icon-content {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        width: 50px; // 设置宽度为 50px
        height: 50px; // 设置高度 50px
        align-items: center;// 垂直居中
        justify-content: center; // 水平居中
        border-radius: 50%; // 设置圆角，使其呈现圆形
        background: rgba(255, 255, 255, 0.7); // 半透明背景色
        font-size: 20px; // 字体大小 20px
        overflow: hidden; // 隐藏溢出内容，防止溢出影响布局
        transition: transform 0.2s ease-in-out; // 添加过渡效果，缓动效果为 ease-in-out，即先慢后快

        // 图标样式
        .link-icon {
            width: 50%;
            height: 50%;
        }
    }
    // 悬停效果
    &:hover .link-icon-content {
        transform: scale(1.1); // 悬停时整体放大 10%
        background: rgba(255, 255, 255, 1); // 半透明背景色
        box-shadow: 0 0 10px rgba(255, 255, 255, 1); // 白色半透明阴影，增强视觉效果
    }

    // 链接名称
    .link-name {
        max-width: 80px; // 最大宽度 80px
        margin-top: 5px; // 上外边距 5px，和图标之间留出一定的间距
        font-size: 12px; // 字体大小 16px
        color: black;
        font-weight: normal; // normal 表示正常字体，不加粗
        font-style: normal; // normal 表示正常字体，不斜体
        white-space: nowrap; // 不换行
        overflow: hidden; // 隐藏溢出内容
        text-overflow: ellipsis; // 超出部分显示省略号
    }
}
</style>
