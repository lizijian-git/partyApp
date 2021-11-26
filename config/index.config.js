/**
 * @Description:
 * @author: lizijian
 * @createTime: 2021-11-2 11:04:24
 */
const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'https://www.ipinjie.cn', // 后台接口请求地址
		// baseUrl: 'http://192.168.101.56:8080', // 后台接口请求地址
        // baseUrl: '', // 后台接口请求地址
        hostUrl: 'http://m.share.com', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: '', // 微信公众号appid
		componentAppid: 'wxda892c29f2324232', //第三方平台appId
		qqmapsdkApiKey: 'BQMBZ-4536U-UPNVO-4WBCU-V2C3E-2RFWK', //腾讯位置服务Api Key
        ossBase: 'https://yingdioss.oss-cn-shenzhen.aliyuncs.com/',
		// 阿里云oss上传配置
		accessKeyId: 'LTAIxuSZ1cqhh4hI',
		accessKeySecret: '26Tdq8dNiPJFvQh0EQ4l4pnod2X7y7',
		bucket: 'benben-bucket'
    },
    // 生产环境配置
    production: {
        mallId: 1,
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://www.pinxinde.com', // 后台接口请求地址
        // baseUrl: 'https://youyoushop.com.cn', // 后台接口请求地址
        // hostUrl: 'http://m.share.com', // H5地址(前端运行地址)
        baseUrl: 'http://127.0.0.1:8080', // 后台接口请求地址
        websocketUrl: '', // websocket服务端地址
        weixinAppId: '',// 微信公众号appid,
        ossBase: 'https://yingdioss.oss-cn-shenzhen.aliyuncs.com/'
    }

};
export default CONFIG[process.env.NODE_ENV];
