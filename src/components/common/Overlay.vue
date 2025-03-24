<template>
    <!-- vue 的过渡动画组件；name 属性用于指定动画名称 -->
    <transition name="overlay">
        <!-- 蒙版容器 -->
        <div class="overlay" v-show="visible">
            <!-- 插槽，用于插入需要展示的内容 -->
            <slot></slot>
        </div>
    </transition>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { toRefs } from 'vue';
    // 接收父组件传递的参数
    const props = defineProps(['visible']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { visible } = toRefs(props);
</script>

<style scoped lang="less">
// 蒙版样式
.overlay {
    position: fixed; // fixed：固定定位，相对于浏览器窗口定位
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    top: 0; // 顶部对齐
    left: 0; // 左侧对齐
    width: 100%; // 宽度 100%
    height: 100%; // 高度 100%
    justify-content: center; // center 表示水平居中
    align-items: center; // center 表示垂直居中
    background-color: rgba(0, 0, 0, 0.5); // 设置半透明背景
    z-index: 1000; // 设置层级
    perspective: 1000px; // 为3D效果提供视角
}

// 当元素处于 进入过渡激活 或 离开过渡激活 状态时，表示动画正在进行中
.overlay-enter-active, .overlay-leave-active {
    transition: opacity 0.5s ease; // 添加过渡动画；若是插槽中的组件也有过渡动画，需要保持时间一致
}
// 当元素处于 进入开始 或 离开结束 阶段，表示动画刚开始或动画最后的样式
.overlay-enter-from, .overlay-leave-to {
    opacity: 0; // 设置透明度为 0
}
</style>
