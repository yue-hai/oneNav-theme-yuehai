<template>

</template>

<script setup>
    /**
     * 此处代码块用于引入组件需要的 API、传递的数据和方法、通用数据
     */
    // 引入 vue3 的响应式 API
    import { ref } from 'vue'


    /**
     * 此处代码块用于定义导航列表组件的数据和方法
     */
    // 导航数据
    const categories = ref([])
    // 模拟获取导航数据
    const fetchNavData = async () => {
        // 实际项目中这里应该调用 API
        categories.value = [
            {
                "id": "20",
                "name": "um773",
                "add_time": "1739428989",
                "up_time": "1739430835",
                "weight": "89",
                "property": "1",
                "description": "um773",
                "font_icon": "fa fa-server",
                "fid": "0",
                "fname": null,
                "link_num": "0",
                "link_list": [],
                "children": [
                    {
                        "id": "24",
                        "name": "个人网站",
                        "add_time": "1739432631",
                        "up_time": "1739432928",
                        "weight": "99",
                        "property": "1",
                        "description": "个人网站",
                        "font_icon": "fa fa-chrome",
                        "fid": "20",
                        "fname": "um773",
                        "link_num": "1",
                        "link_list": [
                            {
                                "id": "1",
                                "fid": "24",
                                "title": "月海",
                                "url": "https://tool.yuehai.fun:63/static/front/index.html#/",
                                "description": "月海的一些小工具的前端页面",
                                "add_time": "1739429081",
                                "up_time": "1739432960",
                                "weight": "9999",
                                "property": "0",
                                "click": "6",
                                "topping": "0",
                                "url_standby": "",
                                "font_icon": "data/upload/202502/vL4L4B.ico",
                                "check_status": "0",
                                "last_checked_time": null,
                                "category_name": "个人网站"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "21",
                "name": "台式机",
                "add_time": "1739430809",
                "up_time": "1739431876",
                "weight": "88",
                "property": "1",
                "description": "台式机",
                "font_icon": "fa fa-desktop",
                "fid": "0",
                "fname": null,
                "link_num": "1",
                "link_list": [
                    {
                        "id": "21",
                        "fid": "21",
                        "title": "Syncthing",
                        "url": "http://127.0.0.1:8384/#",
                        "description": "Syncthing",
                        "add_time": "1739430917",
                        "up_time": null,
                        "weight": "99",
                        "property": "0",
                        "click": "1",
                        "topping": "0",
                        "url_standby": "",
                        "font_icon": null,
                        "check_status": "0",
                        "last_checked_time": null,
                        "category_name": "台式机"
                    }
                ],
                "children": []
            },
        ]
    }
    fetchNavData()

</script>

<style scoped>

</style>
