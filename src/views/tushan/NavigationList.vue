<template>
    <!-- 导航列表组件 -->
    <div class="navigation-list">
        <!-- 导航分类容器，用于展示分类抽屉、设置滚动事件 -->
        <div class="category-container" ref="categoryContainerRef">
            <!-- 遍历导航分类数据 -->
            <div class="category-list" v-for="category in navigationDataList" :key="category.id">
                <!-- 使用 CategoryDrawer 组件展示分类数据，并传递点击分类滚动链接列表方法 -->
                <CategoryDrawer :category="category" :clickCategoryScrollLink="clickCategoryScrollLink"/>
            </div>
        </div>

        <!-- 导航链接容器，用于展示链接列表、设置滚动事件 -->
        <div class="link-container" ref="linkContainerRef">
            <!-- 遍历导航链接数据 -->
            <div class="link-category-list" v-for="category in navigationDataList" :key="category.id">
                <!-- 使用 LinkList 组件展示链接数据 -->
                <LinkList :category="category" />
            </div>
        </div>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    import { ref, inject, onMounted, onBeforeUnmount } from 'vue'
    // 使用 inject 接收父组件使用 provide 提供的方法和数据
    const { showNavigationList } = inject('showNavigationList');
    // 引入 navigationData 仓库，用于读取导航数据
    import { navigationDataStore } from "@/store/navigationData.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { navigationDataList } = storeToRefs(navigationDataStore());


    /**
     * 此处代码块用于引入组件
     */
    // 引入 CategoryDrawer 分类抽屉组件
    import CategoryDrawer from '@/views/tushan/CategoryDrawer.vue';
    // 引入 LinkList 链接列表组件
    import LinkList from "@/views/tushan/LinkList.vue";


    /**
     * 此处代码块用于监听滚动事件，控制导航列表组件的显示和隐藏逻辑
     */
    /**
     * 创建 ref 绑定 .category-container 元素
     * @type {import('vue').Ref<HTMLElement>}
     */
    const categoryContainerRef = ref(null);
    /**
     * 创建 ref 绑定 .link-container 元素
     * @type {import('vue').Ref<HTMLElement>}
     */
    const linkContainerRef = ref(null);
    /**
     * 监听导航分类容器和的滚动事件，控制导航列表的显示
     * @param event - 鼠标滚轮事件
     */
    const handleCategoryScroll = (event) => {
        // 获取导航分类容器
        const categoryListWrapper = categoryContainerRef.value;
        // 如果导航分类容器不存在，则不执行后续操作
        if (!categoryListWrapper) return;

        // 获取导航分类容器的滚动高度；=== 0 表示滚动到顶部，其他值表示未滚动到顶部
        const scrollTop = categoryListWrapper.scrollTop;
        // 如果向上滚动 且 滚动到顶部，则隐藏导航列表
        if (event.deltaY < 0 && scrollTop === 0) {
            showNavigationList.value = false;
        }
    }
    /**
     * 监听导航链接容器的滚动事件，控制导航列表的显示
     * @param event - 鼠标滚轮事件
     */
    const handleLinkScroll = (event) => {
        // 获取导航链接容器
        const linkListWrapper = linkContainerRef.value;
        // 如果导航链接容器不存在，则不执行后续操作
        if (!linkListWrapper) return;

        // 获取导航链接容器的滚动高度；=== 0 表示滚动到顶部，其他值表示未滚动到顶部
        const scrollTop = linkListWrapper.scrollTop;
        // 如果向上滚动 且 滚动到顶部，则隐藏导航列表
        if (event.deltaY < 0 && scrollTop === 0) {
            showNavigationList.value = false;
        }
    }
    // 组件挂载时添加监听滚动事件
    onMounted(() => {
        // 给导航分类容器添加滚动事件监听
        if (categoryContainerRef.value) {
            // 使用 { passive: true } 优化滚动性能：告诉浏览器不需要阻止默认事件
            categoryContainerRef.value.addEventListener('wheel', handleCategoryScroll, { passive: true });
        }
        // 给导航链接容器添加滚动事件监听
        if (linkContainerRef.value) {
            linkContainerRef.value.addEventListener('wheel', handleLinkScroll, { passive: true });
        }
    })
    // 组件销毁时移除监听事件
    onBeforeUnmount(() => {
        // 移除导航分类容器的滚动事件监听
        if (categoryContainerRef.value) {
            categoryContainerRef.value.removeEventListener('wheel', handleCategoryScroll);
        }
        // 移除导航链接容器的滚动事件监听
        if (linkContainerRef.value) {
            linkContainerRef.value.removeEventListener('wheel', handleLinkScroll);
        }
    })


    /**
     * 此处代码块用于处理点击分类和子分类时链接列表的滚动
     */
    /**
     * 点击分类时，滚动到对应的分类链接列表
     * @param type - 分类类型
     * @param id - 分类 ID
     */
    const clickCategoryScrollLink = (type, id) => {
        // 根据分类类型和 ID，拼接目标元素的 ID
        const targetId = type === 'category' ? `category-${id}` : `children-category-${id}`;
        // 根据目标元素 ID 获取目标元素
        const element = document.getElementById(targetId);
        // 判断目标元素是否存在，以及导航链接容器是否存在
        if (element && linkContainerRef.value) {
            // 使用 scrollTo 方法滚动到目标元素
            linkContainerRef.value.scrollTo({
                // 滚动到目标元素的左上角
                top: element.offsetTop,
                // 滚动方式：平滑滚动
                behavior: 'smooth'
            });
        }
    };
</script>

<style scoped lang="less">
.navigation-list {
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    height: 100%; // 高度占满整个页面
    overflow: hidden; // 隐藏溢出内容

    // 导航分类容器样式
    .category-container {
        width: 200px; // 宽度 200px
        height: 100%;// 高度占满整个页面
        padding: 10px 0; // 上下内边距 10px，左右内边距 0
        border-radius: 20px 0 0 0; // 圆角：左上
        user-select: none; // 不可复制
        overflow-y: auto; // 启用滚动
        overflow-x: hidden;// 隐藏水平滚动条
        overscroll-behavior: contain; // 防止滚动穿透

        // 设置滚动条整体样式
        &::-webkit-scrollbar {
            width: 6px; // 设定滚动条的宽度为 6px
        }
        // 设置滚动条的滑块（thumb）样式
        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3); // 滑块的背景颜色，使用半透明白色
            border-radius: 10px; // 设置滑块的圆角
        }
        // 设置当鼠标悬停在滚动条滑块上时的样式
        &::-webkit-scrollbar-thumb:hover {
            /*
                使用 inset box-shadow 来实现滚动条滑块的视觉变化
                8px 0 0 代表 box-shadow 向右偏移 8px，不模糊，没有扩展
                rgba(255, 255, 255, 0.5) 表示半透明白色，提高 hover 状态的可见度
                inset 使 box-shadow 作用于元素内部，增强滚动条的立体感
            */
            box-shadow: 8px 0 0 rgba(255, 255, 255, 0.5) inset;
        }

        // 给最后一个分类容器增加下外边距，避免底部内容被遮挡
        .category-list:last-child {
            margin-bottom: 15px;
        }
    }

    // 导航链接容器样式
    .link-container {
        flex: 1; // 占满剩余空间
        padding: 10px 0 10px 10px; // 上下内边距 10px，左右内边距 10px
        background: rgba(255, 255, 255, 0.2); // 半透明背景
        border-radius: 0 20px 0 0; // 圆角：右上
        overflow-y: auto; // 启用滚动
        overflow-x: hidden; // 隐藏水平滚动条
        overscroll-behavior: contain; // 防止滚动穿透

        // 设置滚动条整体样式
        &::-webkit-scrollbar {
            width: 30px; // 设定滚动条的宽度为 30px
        }
        // 设置滚动条的滑块（thumb）样式
        &::-webkit-scrollbar-thumb {
            border-radius: 24px; // 设置滑块的圆角
            border: 11px solid rgba(0, 0, 0, 0); // 透明的外边框，使滚动条的视觉区域变窄
            /*
                8px 表示阴影向右偏移 8px，使滚动条更靠右
                0 表示垂直方向无偏移
                0 代表无模糊，使阴影清晰
                rgba(255, 255, 255, 0.3) 代表半透明白色，提高滚动条可见度
                inset 使阴影作用于内部，从而形成滚动条的视觉部分
            */
            box-shadow: 8px 0 0 rgba(255, 255, 255, 0.3) inset;
        }
        // 设置当鼠标悬停在滚动条滑块上时的样式
        &::-webkit-scrollbar-thumb:hover {
            box-shadow: 8px 0 0 rgba(255, 255, 255, 0.5) inset; // 悬停时的阴影效果
        }

        // 给最后一个链接容器增加下外边距，避免底部内容被遮挡
        .link-category-list:last-child {
            margin-bottom: 15px;
        }
    }
}
</style>
