<template>
    <!-- 按钮容器项 -->
    <div class="button-container" :title="button.title" >
        <!-- 按钮图标 -->
        <img class="button-icon" :src="button.image" :alt="button.title" />
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 接收父组件传递的参数
    const { button } = defineProps(['button']);
</script>

<style scoped lang="less">
// 按钮容器样式
.button-container {
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    align-items: center;// 垂直居中
    justify-content: center; // 水平居中
    flex-direction: column; // 设置主轴方向为垂直方向
    border-radius: 50%; // 设置圆角，使其呈现圆形
    background: rgba(255, 255, 255, 0.7); // 半透明背景色
    font-size: 20px; // 字体大小 20px
    overflow: hidden; // 隐藏溢出内容，防止溢出影响布局
    cursor: pointer; // 鼠标悬停时显示小手
    transition: transform 0.2s ease-in-out; // 添加过渡效果，缓动效果为 ease-in-out，即先慢后快

    // 悬停效果
    &:hover {
        transform: scale(1.1); // 悬停时整体放大 10%
        background: rgba(255, 255, 255, 1); // 半透明背景色
        box-shadow: 0 0 10px rgba(255, 255, 255, 1); // 白色半透明阴影，增强视觉效果
    }

    // 图标样式
    .button-icon {
        width: 50%;
        height: 50%;
    }
}
</style>
