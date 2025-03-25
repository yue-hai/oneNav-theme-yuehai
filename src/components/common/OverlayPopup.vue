<template>
    <!-- 蒙版动画，渐显渐隐；vue 的过渡动画组件，name 属性用于指定动画名称 -->
    <transition name="fade">
        <!-- 蒙版容器，点击蒙版时关闭弹窗 -->
        <div class="overlay" v-show="overlayPopupStates[activeOverlayPopup]" @click="popupMethodStore().closeOverlayPopup()">

            <!-- 蒙版弹窗组件动画 -->
            <transition :name="lastPopupAnimation">
                <!-- 动态组件，根据 activeOverlayPopup 显示不同的弹窗 -->
                <component :is="overlayPopupStates[activeOverlayPopup]?.component" :popup-data="overlayPopupStates[activeOverlayPopup]"/>
            </transition>

        </div>
    </transition>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, watch } from 'vue';
    // 引入 popupMethodStore 仓库，用于管理提示弹窗和蒙版弹窗
    import { popupMethodStore } from "@/store/popupMethod.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { activeOverlayPopup, overlayPopupStates } = storeToRefs(popupMethodStore());


    /**
     * 此处代码块用于定义组件内部的数据和方法
     */
    /**
     * 保存上一个显示的 蒙版弹窗组件的动画名，防止蒙版弹窗组件关闭(即 activeOverlayPopup = null) 时，
     * overlayPopupStates[activeOverlayPopup].animation 为 undefined，导致离开动画失效
     * @type {import('vue').Ref<string>}
     */
    const lastPopupAnimation = ref('');
    // 监听 activeOverlayPopup 的变化
    watch(activeOverlayPopup, (newValue, _) => {
            // 当 activeOverlayPopup 变化时，如果新值不为 null，则将其保存到 overlayPopup 中
            if (newValue !== null) {
                lastPopupAnimation.value = overlayPopupStates.value[newValue].animation;
            }
        }
    );
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
    perspective: 1000px; // 为 3D 效果提供视角
}

/*
 * Vue 的 <transition name="fade"> 在进入与离开阶段，会自动给元素添加或移除如下类名：
 * 1. .fade-enter-active：进入过渡激活阶段，表示进入动画即将开始
 * 2. .fade-enter-from：进入开始阶段，表示进入动画的第一帧
 * 3. .fade-enter-to：进入结束阶段，表示进入动画的最后一帧
 * 4. .fade-leave-active：离开过渡激活阶段，表示离开动画即将开始
 * 5. .fade-leave-from：离开开始阶段，表示离开动画的第一帧
 * 6. .fade-leave-to：离开结束阶段，表示离开动画的最后一帧
 *
 * 通过给这些类名编写样式，可以控制元素的 进入 和 离开 动画。
 */
// 渐隐渐显动画：当组件即将 进入 或 离开 时
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out; // 对透明度属性使用 0.5 秒的过渡，并使用 ease-in-out 的缓动函数
}
// 渐隐渐显动画：当组件执行 进入动画的第一帧 或 离开动画的最后一帧 时
.fade-enter-from, .fade-leave-to {
    opacity: 0; // 设置透明度为 0，即不可见状态
}
// 渐隐渐显动画：当组件执行 进入动画的最后一帧 或 离开动画的第一帧 时
.fade-enter-to, .fade-leave-from {
    opacity: 1; // 设置透明度为 1，即可见状态
}

// 前后翻转动画：当组件即将 进入 或 离开 时
.flip-from-back-enter-active, .flip-from-back-leave-active {
    transition: all 0.5s ease-in-out; // 对所有可动画属性 (all) 使用 0.5 秒的过渡，并使用 ease-in-out 的缓动函数
}
// 前后翻转动画：当组执行 进入动画的第一帧 或 离开动画的最后一帧 时
.flip-from-back-enter-from, .flip-from-back-leave-to {
    transform: translate(-50%, -50%) rotateX(-60deg); // 让元素在水平、垂直方向居中的同时，在 X 轴上旋转 -60 度，让元素像是从屏幕中 后方 翻转过来。
    opacity: 0; // 将元素的透明度设置为 0，即不可见状态
}
// 前后翻转动画：当组执行 进入动画的最后一帧 或 离开动画的第一帧 时
.flip-from-back-enter-to, .flip-from-back-leave-from {
    transform: translate(-50%, -50%) rotateX(-10deg);// 让元素依旧居中，但把旋转角度变小 (-10度)，这样从 -60度到 -10度的变化就体现了翻转效果。
    opacity: 1; // 将元素的透明度设为 1，即可见状态
}
</style>
