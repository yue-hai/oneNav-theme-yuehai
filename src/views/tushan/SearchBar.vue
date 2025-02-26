<template>
    <!-- 搜索栏组件；isNavigationVisible 用于控制搜索栏的上移 -->
    <div class="search" :class="{ 'search-move-up': isNavigationVisible }">
        <!-- 搜索栏主体容器 -->
        <div class="search-container">
            <!-- 搜索引擎选择图标 -->
            <div class="search-engine" @click="toggleSearchEngine">
                <img :src="currentEngine.icon" :alt="currentEngine.name" />
            </div>
            <!-- 搜索输入框 -->
            <input id="search-box" v-model="searchText" placeholder="搜一搜？" @keyup.enter="handleSearch" @focus="showSuggestions = true"/>
            <!-- 搜索按钮 -->
            <div class="search-confirm" @click="handleSearch">
                <img :src="searchIcon" alt="search" />
            </div>
        </div>

        <!-- 搜索引擎选择面板 -->
        <div v-if="showEngineSelect" class="engine-select">
            <!-- 搜索引擎列表容器 -->
            <div class="engine-list">
                <!-- 搜索引擎图标 -->
                <div class="engine-item" v-for="engine in tushanStaticData.searchEngines" :key="engine.name" @click="selectEngine(engine)">
                    <img :src="engine.icon" :alt="engine.name" />
                </div>
            </div>
        </div>

        <!-- 搜索建议面板 -->
        <div v-if="showSuggestions && searchText" class="suggestions">
            <!-- 搜索建议列表 -->
            <div class="suggestion-item" v-for="suggestion in suggestions" :key="suggestion" @click="handleSuggestionClick(suggestion)">
                {{ suggestion }}
            </div>
        </div>
    </div>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, watch, onUnmounted } from 'vue'
    // 接收父组件传递的参数
    const { isNavigationVisible } = defineProps(['isNavigationVisible']);
    // 引入静态数据
    import { tushanStaticData } from '@/data/tushanStaticData.js';
    // 引入搜索建议处理工具
    import { fetchSuggestions, cleanupSuggestions } from '@/utils/tushan/searchSuggestion.js';
    // 引入搜索图标
    import searchIcon from '@/assets/images/tushan/searchBar/搜索.svg'


    /**
     * 此处代码块用于定义搜索栏组件的数据和方法
     */
    // 当前搜索引擎；默认为第一个搜索引擎
    const currentEngine = ref(tushanStaticData.searchEngines[0])
    // 搜索文本
    const searchText = ref('')
    // 点击搜索引擎图标，显示/隐藏搜索引擎选择面板
    const toggleSearchEngine = () => {
        // 切换搜索引擎选择面板的显示状态
        showEngineSelect.value = !showEngineSelect.value
        // 隐藏搜索建议面板
        showSuggestions.value = false
    }
    // 搜索方法，根据搜索文本和当前搜索引擎进行搜索
    const handleSearch = () => {
        // 如果搜索文本为空，则不执行搜索
        if (!searchText.value) return

        // 判断搜索文本是否为有效 URL，如果有效则直接使用搜索文本作为 URL，否则使用当前搜索引擎的 URL 拼接搜索文本
        const url = isValidUrl(searchText.value) ? searchText.value : currentEngine.value.url + searchText.value
        // 在新标签页打开 URL
        window.open(url, '_blank')
        // 清空搜索文本
        showSuggestions.value = false
    }
    // 工具方法，判断是否为有效的 URL
    const isValidUrl = (str) => {
        try {
            new URL(str)
            return true
        } catch {
            return false
        }
    }


    /**
     * 此处代码块用于定义搜索引擎选择面板的数据和方法
     */
    // 用于控制是否显示搜索引擎选择面板
    const showEngineSelect = ref(false)
    // 点击选择搜索引擎
    const selectEngine = (engine) => {
        // 切换搜索引擎
        currentEngine.value = engine
        // 隐藏搜索引擎选择面板
        showEngineSelect.value = false
    }
    // 监听点击事件，用于关闭弹出面板
    window.addEventListener('click', (e) => {
        // 获取搜索引擎选择面板元素
        const searchEl = document.querySelector('.search-engine')
        // 如果点击的不是搜索引擎选择面板，则隐藏搜索引擎选择面板，否则重新获取搜索建议
        if (!searchEl?.contains(e.target)) {
            // 隐藏搜索引擎选择面板
            showEngineSelect.value = false
        }else{
            // 重新获取搜索建议
            fetchSuggestions(suggestions, currentEngine, searchText.value)
        }
    })


    /**
     * 此处代码块用于定义搜索建议面板的数据和方法
     */
    // 用于控制是否显示搜索建议面
    const showSuggestions = ref(false)
    // 搜索建议列表
    const suggestions = ref([])
    // 点击搜索建议项，填充搜索文本并搜索
    const handleSuggestionClick = (suggestion) => {
        // 将搜索建议填充到搜索文本框
        searchText.value = suggestion
        // 执行搜索
        handleSearch()
    }
    // 监听搜索文本变化，生成搜索建议
    watch(searchText, (newValue) => {
        // 如果搜索文本为空，则清空搜索建议
        if (!newValue) {
            suggestions.value = []
            return
        }
        // 获取搜索建议
        fetchSuggestions(suggestions, currentEngine, newValue)
    })
    // 组件卸载时清理清理全局回调函数和 script 标签
    onUnmounted(() => {
        cleanupSuggestions()
    })
    // 添加点击外部关闭搜索建议面板的功能
    window.addEventListener('click', (e) => {
        // 获取搜索栏容器
        const searchContainer = document.querySelector('.search-container')
        // 获取搜索建议面板
        const suggestionsPanel = document.querySelector('.suggestions')
        // 如果点击的不是搜索栏容器或搜索建议面板，则隐藏搜索建议面板
        if (!searchContainer?.contains(e.target) && !suggestionsPanel?.contains(e.target)) {
            showSuggestions.value = false
        }
    })
</script>

<style scoped lang="less">
// 搜索栏样式
.search {
    position: relative; // 设置定位为相对定位，方便内部元素和伪元素定位
    width: 100%; // 宽度占满父容器
    max-width: 600px; // 最大宽度 600px
    margin: 20vh auto 0; // 上边距 20vh，左右居中
    user-select: none; // 不可复制
    transition: transform 0.4s ease; // 添加平滑动画

    // 搜索栏主体容器
    .search-container {
        display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
        width: 100%; // 宽度占满父容器
        align-items: center; // 垂直居中
        background: white; // 白色背景
        border-radius: 24px; // 圆角 24px
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); // 阴影

        // 搜索引擎选择图标 (左侧)
        .search-engine {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            flex: 0 0 50px; // 固定宽度 50px，不可伸缩
            padding: 13px 15px; // 内边距
            align-items: center; // 垂直居中
            justify-content: center; // 水平居中
            background: #F0F8FF; // 设置左侧背景颜色
            border-top-left-radius: 24px; // 左上角圆角
            border-bottom-left-radius: 24px; // 左下角圆角
            cursor: pointer; // 使鼠标悬停时显示小手
            // 搜索引擎图标样式
            img {
                width: 24px; // 图标宽度 24px
                height: 24px; // 图标高度 24px
                object-fit: contain; // 图标填充方式：保持原始比例
            }
        }

        // 输入框 (占满中间空间)
        input {
            flex-grow: 1; // 占满剩余空间
            border: none; // 去除边框
            outline: none; // 去除输入框默认样式
            font-size: 16px; // 字体大小 16px
            padding: 0 12px; // 左右内边距 12px
        }

        // 搜索按钮 (右侧)
        .search-confirm {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            flex: 0 0 35px; // 固定宽度 35px，不可伸缩
            padding: 13px 15px; // 内边距
            align-items: center; // 垂直居中
            justify-content: center; // 水平居中
            background: #F0F8FF; // 设置右侧背景颜色
            border-top-right-radius: 24px; // 右上角圆角
            border-bottom-right-radius: 24px; // 右下角圆角
            cursor: pointer; // 使鼠标悬停时显示小手
            // 搜索图标样式
            img {
                width: 24px; // 图标宽度 24px
                height: 24px; // 图标高度 24px
                object-fit: contain; // 图标填充方式：保持原始比例
            }
        }
    }

    // 搜索引擎选择面板
    .engine-select {
        position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
        top: 100%; // 位于搜索栏下方
        left: 10px; // 调整位置，使其与搜索栏对齐
        margin-top: 12px; // 增加间距，使三角形不遮挡内容
        padding-left: 10px; // 左侧内边距
        background: white; // 白色背景
        border-radius: 12px; // 圆角 12px
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); // 阴影
        z-index: 10; // 设置 z-index 为 10，确保在搜索建议面板之上
        display: inline-block; // 行内块元素

        // 添加上方的三角形
        &::before {
            content: ""; // 设置伪元素内容为空
            position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
            top: -10px; // 让三角形位于面板的上方
            left: 20px; // 调整三角形的位置，使其对齐搜索引擎图标
            border-left: 10px solid transparent; // 三角形的左侧边框
            border-right: 10px solid transparent; // 三角形的右侧边框
            border-bottom: 10px solid white; // 三角形颜色与面板背景色一致
        }

        // 搜索引擎列表
        .engine-list {
            display: flex; // flex 表示弹性布局，子元素可以按照一定的比例分配空间
            gap: 12px; // 子元素之间的间距
            padding: 6px; // 内边距

            // 搜索引擎图标容器
            .engine-item {
                border-radius: 8px; // 圆角 8px
                transition: background-color 0.2s; // 添加背景颜色过渡效果
                cursor: pointer; // 使鼠标悬停时显示小手

                // 搜索引擎图标样式
                img {
                    padding: 8px; // 内边距 8px
                    width: 24px; // 图标宽度 24px
                    height: 24px; // 图标高度 24px
                    object-fit: contain; // 图标填充方式：保持原始比例
                }
            }

            // 鼠标悬停时的样式
            .engine-item:hover {
                background: #f5f5f5; // 鼠标悬停时的背景颜色
            }
        }
    }

    // 搜索建议面板
    .suggestions {
        position: absolute; // absolute：绝对定位，相对于最近的已定位的祖先元素
        top: 100%; // 位于搜索栏下方
        left: 0; // 与搜索栏左对齐
        right: 0; // 与搜索栏右对齐
        margin-top: 8px; // 增加间距，使搜索建议面板与搜索栏对齐
        background: white; // 白色背景
        border-radius: 12px; // 圆角 12px
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); // 阴影
        z-index: 10; // 设置 z-index 为 10，确保在搜索引擎选择面板之上
        overflow: hidden; // 让子元素不能超出圆角

        // 搜索建议列表
        .suggestion-item {
            padding: 8px 16px; // 内边距
            transition: background-color 0.2s; // 添加背景颜色过渡效果
            cursor: pointer; // 使鼠标悬停时显示小手
        }

        // 确保第一个搜索建议项在 hover 时仍然保持圆角
        .suggestion-item:first-child {
            border-top-left-radius: 12px; // 左上角圆角
            border-top-right-radius: 12px; // 右上角圆角
        }
        // 确保最后一个搜索建议项在 hover 时仍然保持圆角
        .suggestion-item:last-child {
            border-bottom-left-radius: 12px; // 左下角圆角
            border-bottom-right-radius: 12px; // 右下角圆角
        }
        // 鼠标悬停时的样式
        .suggestion-item:hover {
            background: #f5f5f5; // 鼠标悬停时的背景颜色
        }
    }
}

// 当 NavigationList 显示时，SearchBar 上移 5vh
.search-move-up {
    transform: translateY(-10vh); // 让 SearchBar 向上移动 10vh
}
</style>
