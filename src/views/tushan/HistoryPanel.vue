<template>
    <!-- 历史面板 -->
    <div class="history-panel" :class="{ 'search-move-up': isNavigationVisible }">
        <!-- 历史容器 -->
        <div class="history-container">
            <!-- 遍历历史链接列表 -->
            <LinkItem v-for="link in cacheLinkList" :key="link.id" :link="link"/>

            <!-- 编辑按钮 -->
            <div class="edit-button" @click="openEditForm">
                <HoverButton :button="{ title: '编辑', image: editIcon }" />
            </div>
        </div>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { inject } from 'vue';
    // 使用 inject 接收父组件使用 provide 提供的方法
    const { openPopup, closePopup } = inject('homePopupMethod');
    // 接收父组件传递的参数
    const { isNavigationVisible } = defineProps(['isNavigationVisible']);
    // 引入 cacheTushanStore 仓库，用于读取和保存用户设置
    import { cacheTushanStore } from "@/store/tushan/cacheTushan.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { cacheLinkList, cacheHistoryPanelRows, cacheHistoryPanelColumns, cacheHistoryPanelGap } = storeToRefs(cacheTushanStore());
    // 引入数据格式化工具类
    import { parseNumber, parseGap } from '@/utils/DataFormatutils.js';


    /**
     * 此处代码块用于引入组件和图标
     */
    // 引入 LinkItem 链接项组件
    import LinkItem from "@/components/tushan/LinkItem.vue";
    // 引入 HoverButton 悬停按钮组件
    import HoverButton from "@/components/common/HoverButton.vue";
    // 引入编辑图标
    import editIcon from "@/assets/images/tushan/historyPanel/编辑.svg";
    // 引入行数图标
    import rowIcon from "@/assets/images/tushan/historyPanel/行数.svg";
    // 引入列数图标
    import columnIcon from "@/assets/images/tushan/historyPanel/列数.svg";
    // 引入间距图标
    import gapIcon from "@/assets/images/tushan/historyPanel/文字-间距.svg";


    /**
     * 此处代码块用于点击编辑按钮时的事件处理
     */
    // 点击编辑按钮时，打开基础输入表单
    const openEditForm = () => {
        // 打开基础输入表单
        openPopup('base-input-form',
            {
                inputData: [
                    { title: '行数', value: cacheHistoryPanelRows, image: rowIcon },
                    { title: '列数', value: cacheHistoryPanelColumns, image: columnIcon },
                    { title: '间距', value: cacheHistoryPanelGap, image: gapIcon },
                ],
                sure: "确定",
                // 重置按钮的回调函数
                resetCallback: () => resetForm(),
            },
            (inputValues) => editFormCallback(inputValues)
        );
    };
    /**
     * 编辑表单的确定按钮点击事件
     * @param inputValues 输入框的值，与 inputData 一一对应
     */
    const editFormCallback = (inputValues) => {
        // 保存历史面板的行数
        cacheHistoryPanelRows.value = parseNumber(inputValues["行数"], cacheHistoryPanelRows.value);
        // 保存历史面板的列数
        cacheHistoryPanelColumns.value = parseNumber(inputValues["列数"], cacheHistoryPanelColumns.value);
        // 保存历史面板的间距
        cacheHistoryPanelGap.value = parseGap(inputValues["间距"], cacheHistoryPanelGap.value);

        // 计算并设置历史面板链接总数量
        cacheTushanStore().setTotalLinkCount();
        // 关闭编辑表单
        closePopup('base-input-form');
    };
    /**
     * 编辑表单的重置按钮点击事件
     */
    const resetForm = () => {
        // 重置行数
        cacheHistoryPanelRows.value = 2;
        // 重置列数
        cacheHistoryPanelColumns.value = 6;
        // 重置间距
        cacheHistoryPanelGap.value = "20px";
        // 关闭编辑表单
        closePopup('base-input-form');
    }
</script>

<style scoped lang="less">
// 历史面板样式
.history-panel {
    position: relative; // 设置定位为相对定位，方便内部元素和伪元素定位
    width: 100%; // 宽度占满父容器
    margin: 30px 0; // 上下边距 30px
    user-select: none; // 不可复制
    transition: transform 0.4s ease, opacity 0.4s ease; // 透明度 + 移动动画

    // 历史容器
    .history-container {
        width: fit-content; // 让容器宽度适应网格项内容，而不会自动扩展
        max-width: 100%; // 避免超出父容器
        margin: 0 auto; // 让整个 grid 居中
        display: grid; // 使用网格布局
        grid-template-rows: repeat(v-bind(cacheHistoryPanelRows), auto);// 设置行数，绑定动态行数，每行高度自适应
        grid-template-columns: repeat(v-bind(cacheHistoryPanelColumns), 1fr); // 设置列数，绑定动态列数，每列宽度相等
        place-items: center; // 网格布局的垂直水平居中
        gap: v-bind(cacheHistoryPanelGap); // 设置间距，绑定动态 gap

        // 当鼠标悬停到历史容器上时，显示编辑按钮
        &:hover .edit-button {
            opacity: 1; // 完全显示
            visibility: visible; // 让其可见
        }

        // 编辑按钮
        .edit-button {
            position: absolute; // 设置定位为绝对定位
            top: 50%;  // 顶部 50%
            left: 50%; // 左侧 50%
            transform: translate(-50%, -50%); // 通过 transform 位移自身 50% 达到居中效果
            opacity: 0; // 初始隐藏
            visibility: hidden; // 避免占据空间
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out; // 添加过渡动画

            // 覆盖编辑按钮容器尺寸
            ::v-deep(.button-container) {
                width: 35px; // 宽度 35px
                height: 35px; // 高度 35px
                margin-top: 5px; // 上边距 5px
            }
        }
    }
}

// 当导航列表显示时，搜索栏上移 5vh
.search-move-up {
    transform: translateY(-10vh); // 让历史面板向上移动 10vh，和搜索栏保持一致
    opacity: 0; // 渐渐隐藏
    pointer-events: none; // 禁用所有子元素交互
}
</style>
