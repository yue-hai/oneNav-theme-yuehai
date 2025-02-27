<template>
    <!-- 添加 router-view 来渲染子路由内容 -->
    <router-view />

    <!-- 错误提示组件 -->
    <ErrorTip v-if="isErrorTipVisible" :errorTipData="errorTipData"></ErrorTip>
</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref, provide, onMounted } from 'vue'
    // 引入 vue-router 的路由 API
    import { useRouter } from 'vue-router'
    // 创建 useRoute 实例
    const router = useRouter()
    // 引入 serverConfig 仓库，用于获取 token
    import { serverConfigStore } from "@/store/serverConfig.js";
    // 从环境变量中获取服务器配置文件路径
    const serverConfigPath = import.meta.env.VITE_SERVER_CONFIG_PATH;
    // 引入 API 请求工具类
    import { getApiRequest } from '@/utils/apiRequest.js';
    // 引入通过 oneNav 获取导航数据工具类
    import { getCategoryList } from '@/utils/tushan/getNavigationData.js';


    /**
     * 此处代码块用于引入组件
     */
    // 引入 ErrorTip 错误提示组件
    import ErrorTip from "@/components/common/ErrorTip.vue";


    /**
     * 此处代码块用于控制各种弹窗的显示与隐藏，将方法提供给子组件调用
     */
    // 控制错误提示的显示与隐藏
    const isErrorTipVisible = ref(false);
    // 存储错误提示的数据
    const errorTipData = ref({});
    // 显示错误提示，传递错误提示数据
    const openErrorTip = (data) => {
        errorTipData.value = data;
        isErrorTipVisible.value = true;
    };
    // 关闭错误提示，隐藏错误提示组件
    const closeErrorTip = () => {
        isErrorTipVisible.value = false;
    }


    /**
     * 此处代码块使用 provide 提供方法和数据给子组件调用，子组件通过 inject 接收
     */
    provide('homeMethod', {
        openErrorTip,
        closeErrorTip,
    });


    /**
     * 此处代码块用于获取服务器配置信息、登录信息、导航数据
     */
    // 当组件挂载时，获取服务器配置信息
    onMounted(async () => {
        try {
            // 根据配置，跳转到不同的主题页面；先跳转的原因是为了在获取服务器配置文件时不会出现白屏，提升用户体验
            jumpToTheme();

            // 获取服务器配置文件
            const serverConfigFile = await fetch(serverConfigPath);
            // 将服务器配置文件转换为 JSON 格式
            const serverConfig = await serverConfigFile.json();
            // 获取服务器配置文件中的参数，设置到仓库中
            serverConfigStore().setApiBaseUrlToken(serverConfig.apiBaseUrl, serverConfig.token);

            // 调用获取登录信息的 API
            const loginInfo = await getApiRequest({
                homeMethod: { openErrorTip, closeErrorTip },
                url: `/oneNavApi/index.php`,
                urlParams: { c: "api", method: "check_login" },
            });
            // 获取登录信息成功，调用登录成功回调函数
            loginSuccessCallback(loginInfo.data)
        } catch (error) {
            console.error('配置加载失败：', error);
            // 获取登录信息失败，调用登录失败回调函数
            loginErrorCallback(error)
        }
    });
    /**
     * 根据配置，跳转到不同的主题页面
     */
    const jumpToTheme = () => {
        // 跳转到 tushan 页面
        router.push('/tushan')
    }
    /**
     * 定义获取登录信息成功时的回调函数
     * @param loginInfo 登录信息
     */
    const loginSuccessCallback = (loginInfo) => {
        // 判断响应码是否为 200；不知道为什么，开发环境调用这个接口会失败，但是打包部署之后就可以了，所以开发时先移除判断
        if (loginInfo.code !== 200) {
            // 不是 200，未登录，调用未登录回调函数
            loginErrorCallback();
            // 结束函数执行
            return;
        }

        // 已经登录，调用获取导航数据的 API
        getCategoryList({ openErrorTip, closeErrorTip });
    }
    /**
     * 定义获取登录信息失败时的回调函数
     */
    const loginErrorCallback = () => {
        // 显示错误提示
        openErrorTip({
            text: "用户未登录",
            tooltip: "获取登录信息失败，可能是未登录或接口出错，若已登录请检查 nginx 设置",
            closeCountdown: 5
        });

        // 将当前页面重定向到登录页
        window.location.href = `${serverConfigStore().apiBaseUrl}/index.php?c=login`;
    }
</script>
