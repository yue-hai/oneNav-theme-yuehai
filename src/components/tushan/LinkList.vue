<template>
    <!-- 父级分类 -->
    <div class="parent-container">
        <!-- 左侧内容包装器，用于包裹分类图标和描述 -->
        <div class="left-content">
            <i :class="['category-icon', category['font_icon']]"></i>
            {{ category.description }}
        </div>

        <!-- 链接列表，显示在父级分类下方 -->
        <div class="link-items">
            <a class="link-item" v-for="link in category.link_list" :key="link.id" :href="link.url" target="_blank" :title="link.title">
                <!-- 链接图标容器-->
                <div class="link-icon-content">
                    <!-- 链接图标，当获取到了网站图标时，使用网站图标；当没有获取到网站图标时，使用默认图标 -->
                    <img
                        class="link-icon"
                        :src="linkIconList[link.id] || readImage('tushan/link/链接地球.svg')"
                        :alt="link.title"
                    />
                </div>
                <!-- 链接名称 -->
                <span class="link-name">{{ link.title }}</span>
            </a>
        </div>
    </div>

    <!-- 子级分类 -->
    <div class="children-container" v-for="children in category.children" :key="children.id">
        <!-- 左侧内容包装器，用于包裹子级分类图标和描述 -->
        <div class="left-content">
            <i :class="['category-icon', children['font_icon']]"></i>
            {{ children.description }}
        </div>

        <!-- 链接列表，显示在父级分类下方 -->
        <div class="link-items">
            <a class="link-item" v-for="link in children.link_list" :key="link.id" :href="link.url" target="_blank" :title="link.title">
                <!-- 链接图标容器 -->
                <div class="link-icon-content">
                    <!-- 链接图标，当获取到了网站图标时，使用网站图标；当没有获取到网站图标时，使用默认图标 -->
                    <img
                        class="link-icon"
                        :src="linkIconList[link.id] || readImage('tushan/link/链接地球.svg')"
                        :alt="link.title"
                    />
                </div>
                <!-- 链接名称 -->
                <span class="link-name">{{ link.title }}</span>
            </a>
        </div>
    </div>

</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { inject, toRefs, onMounted, watch } from 'vue'
    // 使用 inject 接收父组件使用 provide 提供的方法
    const homeMethod = inject('homeMethod');
    // 接收父组件传递的参数
    const props = defineProps(['category']);
    // 因为是响应式数据，所以使用 toRefs 将其解构，使其保持响应式
    const { category } = toRefs(props);
    // 引入 serverConfig 仓库，用于获取 token
    import { serverConfigStore } from "@/store/serverConfig.js";
    // 引入 navigationData 仓库，用于读取导航数据
    import { navigationDataStore } from "@/store/navigationData.js";
    // 引入 pinia 转换，将仓库转换为响应式变量
    import { storeToRefs } from "pinia";
    // 使用 storeToRefs 将仓库转换为响应式变量，方便在模板中使用
    const { linkIconList } = storeToRefs(navigationDataStore());
    // 引入 API 请求工具类
    import { getApiRequest } from '@/utils/apiRequest.js';
    // 引入资源读取工具，用于读取图片资源
    import { readImage } from '@/utils/resourceReader.js';


    /**
     * 此处代码块用于获取链接图标
     */
    /**
     * 遍历分类的链接列表，获取链接的图标，并将图标地址存储到 linkIconList 中
     */
    const loadIcons = async () => {
        // 遍历父级链接
        for (const link of category.value?.['link_list'] || []) {
            // 获取父级链接的图标
            linkIconList.value[link.id] = await fetchIcon(link);
        }

        // 遍历子级链接
        for (const children of category.value?.['children'] || []) {
            for (const link of children['link_list'] || []) {
                // 获取子级链接的图标
                linkIconList.value[link.id] = await fetchIcon(link);
            }
        }
    };
    /**
     * 异步获取链接图标，如果图标是通过 font_icon 属性设置的，则直接使用 font_icon 属性值作为图标
     * 如果没有设置 font_icon 属性，则通过请求获取链接的图标，这样获取的图标将转为 base64 编码
     * 如果获取图标失败，则返回 null，使用默认图标
     * @param link
     * @returns {Promise<string|null>} - 图标地址
     */
    const fetchIcon = async (link) => {
        try {
            // 如果链接有 font_icon 属性，则使用 font_icon 属性值作为图标
            if (link["font_icon"]) {
                // 拼接 oneNav 服务器地址和图标路径，获取图标地址
                return `${serverConfigStore().apiBaseUrl}/${link["font_icon"]}`;
            }

            // 将链接中的 http:// 或 https:// 替换为空，获取链接的域名，然后再去除第一个 / 之后的内容
            let domain = link.url.replace(/(http:\/\/|https:\/\/)/, '').split('/')[0];
            // 对域名进行编码，以便在 URL 中传递
            domain = encodeURIComponent(domain);
            // 请求获取图标【
            const response = await getApiRequest({
                homeMethod: homeMethod,
                url: `/faviconkit/${domain}/50`,
                handler: {},
                // 使用 arraybuffer 格式接收数据，获取图标的二进制数据
                responseType: 'arraybuffer',
            });

            // 判断是否获取到了图标数据
            if (response && response.data) {
                // 将 reduce 方法返回的字符串转换为 base64 编码
                const base64 = btoa(
                    // Uint8Array 是一个无符号整型数组，其中的每个元素是一个 8 位无符号整数，是二进制数据
                    new Uint8Array(response.data)
                        // 使用 reduce 方法将二进制数据转换为字符串
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                // 返回 base64 编码的图标数据，
                return `data:image/png;base64,${base64}`;
            }

            // 如果获取图标失败，则返回 null
            return handleIconError(link);
        } catch (error) {
            // 获取图标失败，则返回 null
            return handleIconError(link);
        }
    };
    /**
     * 如果获取链接图标失败，则判断原 linkIconList 中是否有数据，如果有则使用原数据，如果没有则使用默认图标
     * @param link - 链接数据
     * @returns {string|null} - 图标地址
     */
    const handleIconError = (link) => {
        // 如果 linkIconList 中有数据，且是 base64 编码的图标
        if (linkIconList.value[link.id] && linkIconList.value[link.id].startsWith('data:image/png;base64,')) {
            // 直接返回原来的图标
            return linkIconList.value[link.id];
        }

        // 如果 linkIconList 没有数据，则返回 null，使用默认图标
        return null;
    };
    // 组件挂载时加载图标
    onMounted(() => {
        // 加载图标
        loadIcons();
    });
    // 监听导航分类数据变化，重新加载图标
    watch(
        // 监听 category 数据
        category,
        // 当 category 数据变化时，重新加载图标
        () => {
            loadIcons();
        },
        // 深度监听，确保监听到 category 内部数据的变化
        { deep: true }
    );
</script>

<style scoped lang="less">
// 父级分类抽屉样式
.parent-container {
    font-size: 20px; // 字体大小 16px
    font-weight: bold; // 字体加粗
    align-items: center; // 垂直居中
}

// 子级分类抽屉样式
.children-container {
    margin-left: 20px; // 左外边距 20px
    font-size: 16px; // 字体大小 16px
    font-weight: bold; // 字体加粗
    align-items: center; // 垂直居中
    font-style: italic; // 字体斜体
}

// 分类抽屉左侧内容包装器，用于包裹分类图标和描述
.left-content {
    padding: 15px 0; // 上下内边距 15px，左右内边距 0
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    align-items: center; // 垂直居中

    // 分类图标样式
    .category-icon {
        margin-right: 10px; // 右外边距 10px
    }
}

// 链接列表容器
.link-items {
    display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
    width: 100%; // 确保可以占满整个父级容器
    flex-wrap: wrap; // 允许链接项换行
    gap: 15px; // 设置链接项间距
    justify-content: flex-start; // 使所有子元素左对齐

    // 单个链接项
    .link-item {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        width: 80px; // 设置宽度
        flex-direction: column; // 设置主轴方向为垂直方向
        align-items: center; // 垂直居中
        color: inherit; // 继承父级颜色
        text-decoration: none; // 移除链接下划线

        // 圆形图标容器
        .link-icon-content {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            width: 50px; // 设置宽度为 50px
            height: 50px; // 设置高度 50px
            align-items: center;// 垂直居中
            justify-content: center; // 水平居中
            border-radius: 50%; // 设置圆角，使其呈现圆形
            background: azure; // 设置背景颜色
            font-size: 20px; // 字体大小 20px
            overflow: hidden; // 隐藏溢出内容，防止溢出影响布局
            transition: transform 0.2s ease-in-out; // 添加过渡效果，缓动效果为 ease-in-out，即先慢后快

            // 图标样式
            .link-icon {
                width: 50%;
                height: 50%;
            }
        }
        // 悬停效果
        &:hover .link-icon-content {
            transform: scale(1.1); // 悬停时整体放大 10%
            box-shadow: 0 0 10px rgba(255, 255, 255, 1); // 白色半透明阴影，增强视觉效果
        }

        // 链接名称
        .link-name {
            max-width: 80px; // 最大宽度 80px
            margin-top: 5px; // 上外边距 5px，和图标之间留出一定的间距
            font-size: 12px; // 字体大小 16px
            font-weight: normal; // normal 表示正常字体，不加粗
            font-style: normal; // normal 表示正常字体，不斜体
            white-space: nowrap; // 不换行
            overflow: hidden; // 隐藏溢出内容
            text-overflow: ellipsis; // 超出部分显示省略号
        }
    }
}
</style>
