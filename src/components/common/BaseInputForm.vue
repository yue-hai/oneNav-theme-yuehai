<template>
    <!-- vue 的过渡动画组件；name 属性用于指定动画名称，@after-leave 事件用于在动画结束后执行 closeOverlay 方法 -->
    <transition name="form" @after-leave="closeOverlay">
        <!-- 基础输入表单组件容器 -->
        <div class="form-container" @click.stop v-if="baseInputForm.visible">
            <!-- 遍历表单数据，生成输入框 -->
            <div class="input-group" v-for="(item, index) in baseInputForm.data.inputData" :key="index">
                <!-- 输入框的标题和图标 -->
                <div class="label">
                    <!-- 标题 -->
                    <span class="title">{{ item.title }}</span>
                    <!-- 图标 -->
                    <img class="icon" :src="item.image" alt="输入表单图标"/>
                </div>
                <!-- 输入框；绑定输入框的值为 inputValues 数组中的对应项 -->
                <input class="input" type="text" v-model="inputValues[item.title]" :placeholder="item.value"/>
            </div>

            <!-- 确定按钮 -->
            <button class="sure-btn" @click="baseInputForm.callback(inputValues)">{{ baseInputForm.data.sure }}</button>
            <!-- 重置和关闭按钮的容器 -->
            <div class="sub-buttons">
                <!-- 重置按钮 -->
                <button class="reset-btn" @click="baseInputForm.data.resetCallback()">重置</button>
                <!-- 关闭按钮 -->
                <button class="close-btn" @click="closePopup('base-input-form')">关闭</button>
            </div>
        </div>
    </transition>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, inject, toRefs } from 'vue';
    // 使用 inject 接收父组件使用 provide 提供的方法
    const { closePopup } = inject('homePopupMethod');
    // 接收父组件传递的参数
    const props = defineProps(['baseInputForm']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { baseInputForm } = toRefs(props);
    // 定义一个响应式数据，用于存储输入框的值
    const inputValues = ref({});


    /**
     * 此处代码块用于定义关闭组件时的事件处理逻辑
     */
    /**
     * 当组件离开动画结束后，关闭蒙版，防止因蒙版一起关闭导致的组件的离开动画无法正常播放
     */
    const closeOverlay = () => {
        // 清空输入框的值
        inputValues.value = {};
        // 设置蒙版的显示状态：隐藏
        closePopup('overlay');
    };
</script>

<style scoped lang="less">
// 表单容器样式
.form-container {
    position: fixed; // fixed：固定定位，相对于浏览器窗口定位
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    width: 90%; // 设置宽度，占满 90% 的视口宽度
    max-width: 200px; // 设置最大宽度，不超过 200px
    flex-direction: column; // column 表示垂直方向排列
    padding: 20px; // 设置内边距
    gap: 10px; // 元素之间的间距
    top: 50%; // 顶部 50%
    left: 50%; // 左侧 50%
    transform: translate(-50%, -50%) rotateX(-10deg); // 通过 transform 位移自身 50% 达到居中效果，并在 X 轴上旋转 -10 度
    background: rgba(0, 0, 0, 0.6); // 设置背景颜色
    border-radius: 15px; // 设置圆角
    overflow: hidden; // 隐藏溢出内容
    transition: all 0.3s ease-in-out; // 添加过渡动画
    transform-style: preserve-3d; // 保持 3D 效果
    box-shadow: // 设置阴影
        rgba(0, 0, 0, 0.6) 0 2px 4px,
        rgba(0, 0, 0, 0.5) 0 7px 13px -3px,
        rgba(0, 0, 0, 0.3) 0 -3px 0 inset;

    // 输入组样式
    .input-group {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        align-items: center; // 垂直居中对齐
        gap: 10px; // 元素之间的间距

        // 输入框的标题和图标
        .label {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            min-width: 60px; // 为标题预留固定宽度
            align-items: center; // 添加这行实现垂直居中
            gap: 6px; // 元素之间的间距

            // 标题
            .title {
                color: rgba(255, 255, 255, 0.9); // 设置标题颜色
                font-size: 14px; // 设置字体大小
                font-weight: 500; // 设置字体粗细
                white-space: nowrap; // 防止标题换行
                line-height: 1; // 添加这行以确保文本垂直居中
            }
            // 图标
            .icon {
                width: 15px; // 设置图标宽度
                height: 15px; // 设置图标高度
            }
        }

        // 输入框
        .input {
            flex: 1; // 让输入框占据剩余空间
            min-width: 0; // 允许输入框在需要时缩小
            width: 100%; // 确保输入框填充剩余空间
            padding: 10px; // 设置内边距
            background: rgba(0, 0, 0, 0.4); // 设置背景颜色
            border-radius: 15px; // 设置圆角
            border: 2px solid rgba(255, 255, 255, 0.2); // 设置边框
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); // 设置阴影
            color: white; // 设置字体颜色
            font-weight: 500; // 设置字体粗细
            font-size: 14px; // 设置字体大小
            transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out; // 添加过渡动画

            // 占位符样式
            &::placeholder {
                color: rgba(255, 255, 255, 0.4); // 设置占位符颜色
                font-weight: 400; // 设置占位符字体粗细
            }
            // 鼠标悬停和聚焦时的样式
            &:hover, &:focus {
                background-color: rgba(0, 0, 0, 0.6); // 设置背景颜色
                border-color: rgba(255, 255, 255, 0.4); // 设置边框颜色
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); // 设置阴影
                outline: none; // 去除默认的聚焦样式
                transform: scale(1.02); // 设置放大效果
            }
        }
    }

    // 按钮样式
    button {
        padding: 10px 20px; // 设置内边距
        border-radius: 5px; // 设置圆角
        border: none; // 去除边框
        box-shadow: // 设置阴影
            rgba(0, 0, 0, 0.5) 0 2px 4px,
            rgba(0, 0, 0, 0.4) 0 7px 13px -3px,
            rgba(0, 0, 0, 0.3) 0 -3px 0 inset;
        color: #fff; // 设置字体颜色
        font-size: 16px; // 设置字体大小
        font-weight: 500; // 设置字体粗细
        cursor: pointer; // 使鼠标悬停时显示小手
        transition: all 0.3s ease-in-out; // 添加过渡动画

        // 悬停时的样式
        &:hover {
            transform: scale(1.05); // 设置放大效果
        }
    }

    // 确定按钮
    .sure-btn {
        width: 100%; // 宽度占满容器
        margin-bottom: 10px; // 与下面的按钮组保持间距
        background: rgba(64, 158, 255, 0.8); // 明亮的蓝色作为主要操作按钮
    }

    // 重置和关闭按钮的容器
    .sub-buttons {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        width: 100%; // 宽度占满容器
        gap: 10px; // 按钮之间的间距

        // 重置和关闭按钮的样式
        button {
            flex: 1; // 平均分配宽度
            padding: 8px 0; // 调整垂直内边距
            font-size: 14px; // 稍微小一点的字体
        }
        // 重置按钮
        .reset-btn {
            background: rgba(230, 162, 60, 0.6); // 橙色/琥珀色调
        }
        // 关闭按钮
        .close-btn {
            background: rgba(144, 147, 153, 0.6); // 灰色调
        }
    }
}

/*
 * Vue 的 <transition name="form"> 在进入与离开阶段，会自动给元素添加或移除如下类名：
 * 1. .form-enter-active：进入过渡激活阶段
 * 2. .form-enter-from：进入开始阶段
 * 3. .form-enter-to：进入结束阶段
 * 4. .form-leave-active：离开过渡激活阶段
 * 5. .form-leave-from：离开开始阶段
 * 6. .form-leave-to：离开结束阶段
 *
 * 通过给这些类名编写样式，可以控制元素的 进入 和 离开 动画。
 */
// 当元素处于 进入过渡激活 或 离开过渡激活 状态时，表示动画正在进行中
.form-enter-active, .form-leave-active {
    transition: all 0.5s ease-in-out; // 对所有可动画属性 (all) 使用 0.5 秒的过渡，并使用 ease-in-out 的缓动函数
}
// 当元素处于 进入开始 或 离开结束 阶段，表示动画刚开始或动画最后的样式
.form-enter-from, .form-leave-to {
    transform: translate(-50%, -50%) rotateX(-60deg); // 让元素在水平、垂直方向居中的同时，在 X 轴上旋转 -60 度，让元素像是从屏幕中 后方 翻转过来。
    opacity: 0; // 将元素的透明度设置为 0，初始阶段或结束阶段为不可见状态
}
// 当元素处于 进入结束 或 离开开始 阶段时，表示动画快要结束时或离开时的第一帧样式。
.form-enter-to, .form-leave-from {
    transform: translate(-50%, -50%) rotateX(-10deg);// 让元素依旧居中，但把旋转角度变小 (-10度)，这样从 -60度到 -10度的变化就体现了翻转效果。
    opacity: 1; // 将元素的透明度设为 1，从不可见到可见，或在离开时从可见到略有角度后再离场。
}
</style>
