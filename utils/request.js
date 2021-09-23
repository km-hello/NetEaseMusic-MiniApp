// 封装发送请求函数
import config from "./config";

export default (url, data={}, method="GET")=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.host + url,
            data,
            method,
            header:{
                cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U') !== -1):""
            },
            success:(res)=>{
                if(data.isLogin){//判断是否登录请求，处理cookies
                    // wx.setStorageSync('cookies', res.cookies)
                }
                resolve(res.data);
            },
            fail:(err)=>{
                reject(err);
            }
          })
    })
}