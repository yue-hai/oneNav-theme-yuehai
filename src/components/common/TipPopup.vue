<template>
    <!-- 遍历 tipPopupStates -->
    <div v-for="(popup, key) in tipPopupStates" :key="key">
        <!-- 提示弹窗组件动画；分别为每个弹窗设置动画 -->
        <transition :name="popup.animation">
            <!-- 动态组件，根据 activeTipPopup 显示不同的弹窗 -->
            <component :is="popup.component" v-if="popup.visible" :popup-data="popup"/>
        </transition>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 popupMethodStore 仓库，用于管理提示弹窗和蒙版弹窗
    import { popupMethodStore } from "@/store/popupMethod.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { tipPopupStates } = storeToRefs(popupMethodStore());
</script>

<style scoped lang="less">
/*
 * Vue 的 <transition name="tip"> 在进入与离开阶段，会自动给元素添加或移除如下类名：
 * 1. .tip-enter-active：进入过渡激活阶段，表示进入动画即将开始
 * 2. .tip-enter-from：进入开始阶段，表示进入动画的第一帧
 * 3. .tip-enter-to：进入结束阶段，表示进入动画的最后一帧
 * 4. .tip-leave-active：离开过渡激活阶段，表示离开动画即将开始
 * 5. .tip-leave-from：离开开始阶段，表示离开动画的第一帧
 * 6. .tip-leave-to：离开结束阶段，表示离开动画的最后一帧
 *
 * 通过给这些类名编写样式，可以控制元素的 进入 和 离开 动画。
 */
// 当蒙版即将 进入 或 离开 时
.tip-enter-active, .tip-leave-active {
    transition: opacity 0.5s ease-in-out; // 对透明度属性使用 0.5 秒的过渡，并使用 ease-in-out 的缓动函数
}
// 当蒙版执行 进入动画的第一帧 或 离开动画的最后一帧 时
.tip-enter-from, .tip-leave-to {
    opacity: 0; // 设置透明度为 0，即不可见状态
}
// 当蒙版执行 进入动画的最后一帧 或 离开动画的第一帧 时
.tip-enter-to, .tip-leave-from {
    opacity: 1; // 设置透明度为 1，即可见状态
}
</style>
