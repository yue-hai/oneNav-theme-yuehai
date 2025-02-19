// 引入资源读取工具，用于读取图片资源
import { readImage } from '@/utils/resourceReader.js';

/**
 * 该文件用于存放 tushan 静态数据
 */
export const tushanStaticData = {
    // 导航标签数据
    searchEngines: [
        {
            name: 'bing',
            icon: readImage("tushan/searchBar/bing.svg"),
            url: 'https://www.bing.com/search?q=',
            suggestionUrl: '/bing/qsonhs.aspx?q='
        },
        {
            name: 'google',
            icon: readImage("tushan/searchBar/google.svg"),
            url: 'https://www.google.com/search?q=',
            suggestionUrl: '/google/complete/search?client=firefox&q='
        },
        {
            name: 'baidu',
            icon: readImage("tushan/searchBar/baidu.svg"),
            url: 'https://www.baidu.com/s?wd=',
            suggestionUrl: '/baidu/su?wd='
        },
        {
            name: 'sogou',
            icon: readImage("tushan/searchBar/sogou.svg"),
            url: 'https://www.sogou.com/web?query=',
            suggestionUrl: '/baidu/su?wd='
        },
        {
            name: '360',
            icon: readImage("tushan/searchBar/360.svg"),
            url: 'https://www.so.com/s?q=',
            suggestionUrl: '/baidu/su?wd='
        }
    ],
}
