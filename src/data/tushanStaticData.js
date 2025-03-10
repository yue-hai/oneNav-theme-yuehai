// 引入 bing图标
import bingIcon from '@/assets/images/tushan/searchBar/bing.svg';
// 引入 google图标
import googleIcon from '@/assets/images/tushan/searchBar/google.svg';
// 引入 baidu图标
import baiduIcon from '@/assets/images/tushan/searchBar/baidu.svg';
// 引入 sogou图标
import sogouIcon from '@/assets/images/tushan/searchBar/sogou.svg';
// 引入 360 图标
import soIcon from '@/assets/images/tushan/searchBar/360.svg';

/**
 * 该文件用于存放 tushan 静态数据
 */
export const tushanStaticData = {
    // 导航标签数据
    searchEngines: [
        {
            name: 'bing',
            icon: bingIcon,
            url: 'https://www.bing.com/search?q=',
        },
        {
            name: 'google',
            icon: googleIcon,
            url: 'https://www.google.com/search?q=',
        },
        {
            name: 'baidu',
            icon: baiduIcon,
            url: 'https://www.baidu.com/s?wd=',
        },
        {
            name: 'sogou',
            icon: sogouIcon,
            url: 'https://www.sogou.com/web?query=',
        },
        {
            name: '360',
            icon: soIcon,
            url: 'https://www.so.com/s?q=',
        }
    ],
}
