// 从 vite 库中导入 defineConfig 方法，用于定义 Vite 的配置
import { defineConfig } from 'vite'
// 从 @vitejs/plugin-vue 导入 Vue 插件，集成 Vue 支持
import vue from '@vitejs/plugin-vue'
// 从 path 模块中导入 resolve 方法，用于解析路径
import { resolve } from "path"

// 导出默认配置对象，Vite 使用此配置来构建项目
export default defineConfig({
    // 插件配置项，配置 Vite 使用 Vue 插件进行编译和解析
    plugins: [vue()],
    // 配置根路径，Vite 会从根路径开始查找文件，这里设置为当前目录
    base: './',
    // 服务器相关配置
    server: {
        // 服务器监听的主机地址，这里设置为 0.0.0.0，表示允许外部通过 IP 访问
        host: '0.0.0.0',
        // 设置服务器的端口号为 81
        port: 81,
        // 配置代理服务器，解决开发环境中的跨域问题
        proxy: {
            // 代理 /api 路径下的请求
            '/api': {
                // 目标服务器地址，代理将请求转发到该地址
                target: 'http://127.0.0.1:80',
                // 重写请求路径，将 /api 前缀去掉，转发时路径为原始路径；例如：/api/data/findDuplicate -> /data/findDuplicate
                rewrite: (path) => path.replace(/^\/api/, ''),
                // 是否启用 WebSocket 代理
                ws: true,
                // 更改请求的源站，伪装为目标服务器发送请求，解决跨域问题
                changeOrigin: true
            }
        }
    },
    // 路径解析配置
    resolve: {
        // 配置路径别名，使用 "@" 表示 src 目录
        alias: {
            "@": resolve(__dirname, "./src")
        }
    }
})
