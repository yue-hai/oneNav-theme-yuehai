<template>
    <!-- 父级分类 -->
    <div class="parent-container">
        <!-- 左侧内容包装器，用于包裹分类图标和描述 -->
        <div class="left-content">
            <i :class="['category-icon', category['font_icon']]"></i>
            {{ category.description }}
        </div>

        <!-- 链接列表，显示在父级分类下方 -->
        <div class="link-items">
            <a class="link-item" v-for="link in category.link_list" :key="link.id" :href="link.url" target="_blank">
                <!-- 圆形图标 -->
                <div class="link-icon">
                    <i :class="link.font_icon || 'default-icon'">🔗</i>
                </div>
                <!-- 链接名称 -->
                <span class="link-name">{{ link.title }}</span>
            </a>
        </div>
    </div>

    <!-- 子级分类 -->
    <div class="children-container" v-for="children in category.children" :key="children.id">
        <!-- 左侧内容包装器，用于包裹子级分类图标和描述 -->
        <div class="left-content">
            <i :class="['category-icon', children['font_icon']]"></i>
            {{ children.description }}
        </div>

        <!-- 链接列表，显示在父级分类下方 -->
        <div class="link-items">
            <a v-for="link in children.link_list" :key="link.id" :href="link.url" target="_blank" class="link-item">
                <!-- 圆形图标 -->
                <div class="link-icon">
                    <i :class="link.font_icon || 'default-icon'">🔗</i>
                </div>
                <!-- 链接名称 -->
                <span class="link-name">{{ link.title }}</span>
            </a>
        </div>
    </div>

</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { toRefs } from 'vue'
    // 接收父组件传递的参数
    const props = defineProps(['category']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { category } = toRefs(props);

    console.log(category.value);

</script>

<style scoped lang="less">
// 父级分类抽屉样式
.parent-container {
    font-size: 20px; // 字体大小 16px
    font-weight: bold; // 字体加粗
    align-items: center; // 垂直居中
}

// 子级分类抽屉样式
.children-container {
    margin-left: 20px; // 左外边距 20px
    font-size: 16px; // 字体大小 16px
    font-weight: bold; // 字体加粗
    align-items: center; // 垂直居中
    font-style: italic; // 字体斜体
}

// 分类抽屉左侧内容包装器，用于包裹分类图标和描述
.left-content {
    padding: 15px 0; // 上下内边距 15px，左右内边距 0
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    align-items: center; // 垂直居中

    // 分类图标样式
    .category-icon {
        margin-right: 10px; // 右外边距 10px
    }
}

// 链接列表容器
.link-items {
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    width: 100%; // 确保可以占满整个父级容器
    flex-wrap: wrap; // 允许链接项换行
    gap: 15px; // 设置链接项间距
    justify-content: flex-start; // 使所有子元素左对齐

    // 单个链接项
    .link-item {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        width: 80px; // 设置宽度
        flex-direction: column; // 设置主轴方向为垂直方向
        align-items: center; // 垂直居中
        color: inherit; // 继承父级颜色
        text-decoration: none; // 移除链接下划线

        // 圆形图标容器
        .link-icon {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            width: 50px; // 设置宽度为 50px
            height: 50px; // 设置高度 50px
            align-items: center;// 垂直居中
            justify-content: center; // 水平居中
            border-radius: 50%; // 设置圆角，使其呈现圆形
            background: azure; // 设置背景颜色
            font-size: 20px; // 字体大小 20px
            transition: transform 0.2s ease-in-out; // 添加过渡效果，缓动效果为 ease-in-out，即先慢后快
        }
        // 悬停效果
        &:hover .link-icon {
            transform: scale(1.1); // 悬停时整体放大 10%
            box-shadow: 0 0 10px rgba(255, 255, 255, 1); // 白色半透明阴影，增强视觉效果
        }

        // 链接名称
        .link-name {
            max-width: 80px; // 最大宽度 80px
            margin-top: 5px; // 上外边距 5px，和图标之间留出一定的间距
            font-size: 12px; // 字体大小 16px
            font-weight: normal; // normal 表示正常字体，不加粗
            font-style: normal; // normal 表示正常字体，不斜体
            white-space: nowrap; // 不换行
            overflow: hidden; // 隐藏溢出内容
            text-overflow: ellipsis; // 超出部分显示省略号
        }
    }
}
</style>
