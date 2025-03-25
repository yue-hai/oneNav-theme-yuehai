<template>
    <!-- 基础输入表单容器 -->
    <div class="form-container" @click.stop>
        <!-- 遍历表单数据，生成输入框 -->
        <div class="input-group" v-for="(item, index) in data.inputData" :key="index">
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
        <button class="sure-btn" @click="callback(inputValues)">{{ data.sure }}</button>
        <!-- 重置和关闭按钮的容器 -->
        <div class="sub-buttons">
            <!-- 重置按钮 -->
            <button class="reset-btn" @click="data.resetCallback()">重置</button>
            <!-- 关闭按钮 -->
            <button class="close-btn" @click="popupMethodStore().closeOverlayPopup()">关闭</button>
        </div>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, toRefs, computed } from 'vue';
    // 接收父组件传递的参数
    const props = defineProps(['popupData']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { popupData } = toRefs(props);
    // 引入 popupMethodStore 仓库，用于管理提示弹窗和蒙版弹窗
    import { popupMethodStore } from "@/store/popupMethod.js";


    /**
     * 此处代码块用于定义组件内部的数据和方法
     */
    // 计算属性，用于设置 data 中的数据
    const data = computed(() => popupData.value.data);
    // 计算属性，用于设置确定按钮的回调函数
    const callback = computed(() => popupData.value.callback);
    // 定义一个响应式数据，用于存储输入框的值
    const inputValues = ref({});
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
    background: rgba(0, 0, 0, 0.8); // 设置背景颜色
    border-radius: 15px; // 设置圆角
    overflow: hidden; // 隐藏溢出内容
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
</style>
