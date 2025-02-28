<template>
    <!-- 错误提示组件 -->
    <div class="tooltip-container">
        <!-- 鼠标悬停时显示的上方的提示文本 -->
        <span class="tooltip">{{ errorTipData.tooltip }}</span>
        <!-- 提示按钮默认显示的内容 -->
        <span class="text">{{ errorTipData.text }} ❌</span>
        <!-- 鼠标悬停时提示按钮显示的内容 -->
        <span>{{ countdown.toFixed(1) }} 秒后自动关闭 🕒</span>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, inject, onMounted, onUnmounted } from 'vue';
    // 使用 inject 接收父组件使用 provide 提供的方法和数据
    const { closeErrorTip } = inject('homeMethod');
    // 接收父组件传递的参数
    const { errorTipData } = defineProps(['errorTipData']);


    /**
     * 此处代码块用于控制错误提示的显示与隐藏、倒计时关闭提示
     */
    // 创建一个响应式数据，用于存储倒计时的秒数
    const countdown = ref(errorTipData.closeCountdown);
    // 用于存储 setTimeout 的 ID，以便在需要时清除定时器
    let closeTimeoutId = null;

    // 倒计时函数
    const startCountdown = () => {
        // setInterval 的作用是每隔一段时间执行一次函数，直到 clearInterval 被调用
        const closeTimeoutId = setInterval(() => {
            // 每次减少 0.1 秒，显示小数
            countdown.value -= 0.1;

            // 当倒计时小于等于 0 时，停止倒计时并触发关闭提示的事件
            if (countdown.value <= 0) {
                // 清除定时器
                clearInterval(closeTimeoutId);
                // 触发关闭提示的事件
                closeErrorTip();
            }
        }, 100); // 更新频率为 100 毫秒（0.1 秒）
    };

    // 组件加载后启动倒计时
    onMounted(() => {
        startCountdown();
    });
    // 组件卸载时清除定时器
    onUnmounted(() => {
        // 清除定时器
        if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
        }
    });
</script>

<style scoped lang="less">
// 错误提示容器的样式定义
.tooltip-container {
    --background: #333333; // 设置背景颜色为深灰色
    --color: #a8a4a4; // 设置文本颜色为浅灰色
    position: fixed; // fixed：固定定位，相对于浏览器窗口定位
    bottom: 40px; // 距离视口底部40像素
    left: 50%; // 水平中心对齐
    transform: translateX(-50%); // X轴偏移50%以确保中心对齐
    cursor: pointer; // 使鼠标悬停时显示小手
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); // 过渡效果，使动画平滑
    font-size: 18px; // 字体大小
    font-weight: 600; // 字体粗细
    color: var(--color); // 文本颜色
    padding: 0.7em 1.8em; // 内边距
    border-radius: 8px; // 边框圆角
    text-transform: uppercase; // 文本转为大写
    height: 60px; // 高度
    width: 180px; // 宽度
    display: grid; // 使用网格布局
    place-items: center; // 居中网格项
    border: 2px solid var(--color); // 边框颜色
    z-index: 10000; // 层级为 10000

    // 鼠标悬停时显示的上方的提示文本样式
    .tooltip {
        position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
        top: 0; // 顶部对齐
        left: 50%; // 水平中心对齐
        transform: translateX(-50%); // X轴偏移 50% 以确保中心对齐
        padding: 0.3em 0.6em; // 内边距
        opacity: 0; // 初始不可见
        pointer-events: none; // 鼠标事件无效
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); // 过渡效果
        background: var(--background); // 背景色
        z-index: -1; // 层级为-1
        border-radius: 8px; // 圆角
        scale: 0; // 缩放
        transform-origin: 0 0; // 变换原点
        text-transform: capitalize; // 首字母大写
        font-weight: 400; // 字体粗细
        font-size: 16px; // 字体大小
        box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px; // 阴影效果
        white-space: nowrap; // 强制文本不换行
    }
    // 鼠标悬停时显示的上方的提示文本样式，下方中间的小三角形样式
    .tooltip::before {
        position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
        content: ""; // 内容为空
        height: 0.6em; // 高度
        width: 0.6em; // 宽度
        bottom: -0.2em; // 底部外推
        left: 50%; // 水平中心对齐
        transform: translate(-50%) rotate(45deg); // 偏移和旋转
        background: var(--background); // 背景色
    }

    // 默认文本的样式
    .text {
        position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
        top: 0; // 顶部对齐
        left: 0; // 左侧对齐
        width: 100%; // 宽度100%
        height: 100%; // 高度100%
        display: grid; // 使用网格布局
        place-items: center; // 居中网格项
        transform-origin: -100%; // 变换原点
        transform: scale(1); // 初始缩放为1
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); // 过渡效果
        background-color: #212121; // 背景颜色
        border-radius: 8px; // 边框圆角
    }

    // 容器最后一个子元素的样式，即鼠标悬停时提示按钮显示的内容样式
    span:last-child {
        position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
        top: 0; // 顶部对齐
        left: 100%; // 左偏移100%，即完全右移
        width: 100%; // 宽度100%
        height: 100%; // 高度100%
        border-radius: 8px; // 圆角
        opacity: 1; // 完全不透明
        background-color: var(--background); // 背景色
        z-index: -1; // 层级为-1
        border: 2px solid var(--background); // 边框颜色
        transform: scale(0); // 初始缩放为0
        transform-origin: 0; // 变换原点
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); // 过渡效果
        display: grid; // 网格布局
        place-items: center; // 内容居中
    }
}

// 鼠标悬停时，整体的样式变化
.tooltip-container:hover {
    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px; // 添加阴影
    color: white; // 文本颜色变为白色
    border-color: transparent; // 边框颜色透明
}
// 鼠标悬停时，鼠标悬停时显示的上方的提示文本的样式变化
.tooltip-container:hover .tooltip {
    top: -70%; // 向上偏移 70%
    opacity: 1; // 完全可见
    pointer-events: auto; // 鼠标事件有效
    scale: 1; // 缩放为1
    animation: shake 0.5s ease-in-out both; // 添加抖动动画
}
// 鼠标悬停时，提示按钮默认显示的内容的样式变化
.tooltip-container:hover .text {
    opacity: 0; // 完全不可见
    top: 0; // 顶部对齐
    left: 100%; // 左侧偏移100%
    transform: scale(0); // 缩放为 0
}
// 鼠标悬停时，鼠标悬停时提示按钮显示的内容的样式变化
.tooltip-container:hover span:last-child {
    transform: scale(1); // 缩放为 1
    left: 0; // 左侧对齐
}

// 鼠标悬停时显示的上方提示文本的抖动动画
@keyframes shake {
    // 初始无旋转
    0% {
        rotate: 0;
    }
    // 执行到 25% 时旋转 7 度
    25% {
        rotate: 7deg;
    }
    // 执行到 50% 时旋转 -7 度
    50% {
        rotate: -7deg;
    }
    // 执行到 75% 时旋转 1 度
    75% {
        rotate: 1deg;
    }
    // 执行到 100% 时旋转到初始位置
    100% {
        rotate: 0;
    }
}
</style>
