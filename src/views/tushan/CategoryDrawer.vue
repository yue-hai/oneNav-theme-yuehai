<template>
    <!-- 分类抽屉容器 -->
    <div class="drawer-container">
        <!-- 父级分类抽屉容器 -->
        <div class="parent-container" @click="toggleDrawer(); clickCategoryScrollLink('category', category.id)">
            <!-- 左侧内容包装器，用于包裹分类图标和描述 -->
            <div class="left-content">
                <i :class="['category-icon', category['font_icon']]"></i>
                {{ category.description }}
            </div>
            <!-- 箭头图标 -->
            <i :class="['parent-arrow', 'fa', 'fa-chevron-down', { 'rotated': isOpen }]"></i>
        </div>

        <!-- 子级目录动画容器；transition 是 Vue 提供的过渡动画组件 -->
        <transition
            name="slide"
            @enter="onEnter"
            @leave="onLeave"
            @after-enter="onAfterEnter"
            @after-leave="onAfterLeave"
        >
            <!-- 子级目录容器；使用 v-if，避免 v-show 影响 height 计算 -->
            <div v-if="isOpen" class="children-wrapper">
                <!-- 遍历子级目录数据 -->
                <div v-for="children in category.children" :key="children.id" class="children-container" @click.stop="clickCategoryScrollLink('children-category', children.id)">
                    <!-- 左侧内容包装器，用于包裹子级分类图标和描述 -->
                    <div class="left-content">
                        <i :class="['category-icon', children['font_icon']]"></i>
                        {{ children.description }}
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, toRefs } from 'vue'
    // 接收父组件传递的参数
    const props = defineProps(['category', 'clickCategoryScrollLink']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { category, clickCategoryScrollLink } = toRefs(props);


    /**
     * 此处代码块用于定义子分类目录的显示和隐藏逻辑、动画效果
     */
    // 控制子级目录的显示和隐藏
    const isOpen = ref(false);
    // 切换子级目录的显示和隐藏
    const toggleDrawer = () => {
        isOpen.value = !isOpen.value;
    }
    /**
     * 动画钩子函数，用于在 Vue 过渡 (transition) 组件中控制高度变化
     * 当元素开始进入（展开）时的动画处理
     * @param {HTMLElement} el - 需要执行动画的 DOM 元素
     */
    const onEnter = (el) => {
        // 获取元素的完整内容高度（包括 padding，但不包括 margin）
        const height = el.scrollHeight;
        // 初始化高度为 0，使其从 0 开始增长
        el.style.height = '0';
        // 使用 requestAnimationFrame 确保动画在下一帧执行，避免浏览器优化导致动画跳跃
        requestAnimationFrame(() => {
            // 赋值目标高度，触发 height 过渡动画
            el.style.height = height + 'px';
        });
    };
    /**
     * 当元素开始离开（折叠）时的动画处理
     * @param {HTMLElement} el - 需要执行动画的 DOM 元素
     */
    const onLeave = (el) => {
        // 记录当前元素的高度
        el.style.height = el.scrollHeight + 'px';
        // 强制浏览器计算高度，确保动画效果生效
        el.offsetHeight;
        // 使用 requestAnimationFrame 让浏览器在下一帧执行动画，避免跳变
        requestAnimationFrame(() => {
            // 让高度渐渐减少到 0，触发折叠动画
            el.style.height = '0';
        });
    };
    /**
     * 当元素完成进入（展开）动画后执行
     * @param {HTMLElement} el - 需要执行动画的 DOM 元素
     */
    const onAfterEnter = (el) => {
        // 清除内联样式的 height，防止影响后续内容自适应高度
        el.style.height = '';
    };
    /**
     * 当元素完成离开（折叠）动画后执行
     * @param {HTMLElement} el - 需要执行动画的 DOM 元素
     */
    const onAfterLeave = (el) => {
        // 清除内联样式的 height，防止影响后续内容自适应高度
        el.style.height = '';
    };
</script>

<style scoped lang="less">
// 分类抽屉容器样式
.drawer-container {
    overflow: hidden; // 隐藏溢出内容，防止溢出影响布局

    // 分类抽屉左侧内容包装器，用于包裹分类图标和描述
    .left-content {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        align-items: center; // 垂直居中

        // 分类图标样式
        .category-icon {
            margin-right: 10px; // 右外边距 10px
        }
    }

    // 父级分类抽屉样式
    .parent-container {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        justify-content: space-between; // 两端对齐
        align-items: center; // 垂直居中
        padding: 15px 20px; // 上下内边距 10px，左右内边距 0
        font-size: 16px; // 字体大小 16px
        font-weight: bold; // 字体加粗
        cursor: pointer; // 鼠标悬停时显示小手

        // 悬停时背景颜色改变
        &:hover {
            background-color: rgba(255, 255, 255, 0.2); // 变浅的白色背景
        }

        // 箭头图标样式
        .parent-arrow {
            font-size: 20px; // 字体大小 16px
            transition: transform 0.3s ease; // 添加过渡效果

            &.rotated {
                transform: rotate(180deg); // 旋转 180 度使箭头朝上
            }
        }
    }

    // 子级目录包装器
    .children-wrapper {
        overflow: hidden; // 隐藏溢出内容，防止溢出影响布局
        transition: height 0.3s ease-out; // 添加过渡效果，高度在 0.3 秒内从初始值过渡到结束值，缓动效果为 ease-out，即先快后慢

        // 子级目录列表样式
        .children-container {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            align-items: center; // 垂直居中
            padding: 15px 0 15px 40px; // 上下内边距 10px，左右内边距 0
            font-size: 14px; // 字体大小 16px
            font-weight: bold; // 字体加粗
            font-style: italic; // 字体斜体
            cursor: pointer; // 鼠标悬停时显示小手

            // 悬停时背景颜色改变
            &:hover {
                background-color: rgba(255, 255, 255, 0.2); // 变浅的白色背景
            }
        }
    }

    /**
        子级目录过渡动画
        slide-enter-active：进入时的过渡动画
        slide-leave-active：离开时的过渡动画
     */
    .slide-enter-active,
    .slide-leave-active {
        /**
            height 0.3s ease-out：高度在 0.3 秒内从初始值过渡到结束值，缓动效果为 ease-out，即先快后慢
            opacity 0.3s ease-out：透明度在 0.3 秒内从初始值过渡到结束值，缓动效果为 ease-out，即先快后慢
         */
        transition: height 0.3s ease-out, opacity 0.3s ease-out;
    }
    /**
        slide-enter-from：进入开始前的状态
        slide-leave-to：离开结束后的状态
     */
    .slide-enter-from,
    .slide-leave-to {
        opacity: 0; // 透明度为 0，完全透明
    }
}
</style>
