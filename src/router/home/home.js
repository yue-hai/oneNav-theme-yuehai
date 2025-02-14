// 导出一个默认的路由配置数组
export default [
    {
        // 路径设置为 /
        path: '/',
        // 为当前路由命名，便于在代码中引用，名称为 Login
        name: 'Home',
        // 按需加载组件，当路由被访问时才加载对应的组件代码，使用箭头函数动态导入登录页面组件
        component: () => import('@/views/home/Home.vue')
    }
]
