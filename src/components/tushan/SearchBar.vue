<template>
    <!-- 搜索栏组件 -->
    <div class="search">
        <!-- 搜索栏主体容器 -->
        <div class="search-container">
            <!-- 搜索引擎选择图标 -->
            <div class="search-engine" @click="toggleSearchEngine">
                <img :src="currentEngine.icon" :alt="currentEngine.name" />
            </div>
            <!-- 搜索输入框 -->
            <input v-model="searchText" placeholder="搜一搜？" @keyup.enter="handleSearch" @focus="showSuggestions = true"/>
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
    import { ref, watch } from 'vue'
    // 引入静态数据
    import { tushanStaticData } from '@/data/tushanStaticData.js';
    // 引入搜索建议处理工具
    import { fetchSuggestions } from '@/utils/tushan/searchSuggestion.js';
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
        // 如果点击的不是搜索引擎选择面板，则隐藏搜索引擎选择面板
        if (!searchEl?.contains(e.target)) {
            // 隐藏搜索引擎选择面板
            showEngineSelect.value = false
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
</script>

<style scoped lang="less">
// 搜索栏样式
.search {
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 20vh auto 0;
    user-select: none; // 不可复制文本

    // 搜索栏主体容器
    .search-container {
        display: flex;
        align-items: center;
        background: white;
        border-radius: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        width: 100%;

        // 搜索引擎选择图标 (左侧)
        .search-engine {
            flex: 0 0 50px; /* 固定宽度 */
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F0F8FF; /* 这里设置左侧背景颜色 */
            border-top-left-radius: 24px;
            border-bottom-left-radius: 24px;
            cursor: pointer;
            padding: 13px 15px;

            img {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }
        }

        // 输入框 (占满中间空间)
        input {
            flex-grow: 1;
            border: none;
            outline: none;
            font-size: 16px;
            padding: 0 12px;
        }

        // 搜索按钮 (右侧)
        .search-confirm {
            flex: 0 0 35px; /* 固定宽度 */
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F0F8FF; /* 这里设置右侧背景颜色 */
            border-top-right-radius: 24px;
            border-bottom-right-radius: 24px;
            cursor: pointer;
            padding: 13px 15px;

            img {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }
        }
    }

    // 搜索引擎选择面板
    .engine-select {
        position: absolute;
        top: 100%;
        left: 10px; /* 确保对齐搜索引擎图标 */
        background: white;
        border-radius: 12px;
        margin-top: 12px; /* 增加间距，使三角形不遮挡内容 */
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
        display: inline-block;
        padding-left: 10px;

        /* 添加上方的三角形 */
        &::before {
            content: "";
            position: absolute;
            top: -10px; /* 让三角形位于面板的上方 */
            left: 20px; /* 调整三角形的位置，使其对齐搜索引擎图标 */
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid white; /* 三角形颜色与面板背景色一致 */
        }

        .engine-list {
            display: flex;
            gap: 12px;
            padding: 6px;

            .engine-item {
                cursor: pointer;
                border-radius: 8px;
                transition: background-color 0.2s;

                img {
                    padding: 8px;
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                }
            }

            .engine-item:hover {
                background: #f5f5f5;
            }
        }
    }

    .suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 12px;
        margin-top: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;

        .suggestion-item {
            padding: 8px 16px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .suggestion-item:hover {
            background: #f5f5f5;
        }
    }
}
</style>
