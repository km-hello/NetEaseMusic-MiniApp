import PubSub from 'pubsub-js'

import request from "../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:"",
        month:"",
        recommendList:[],
        index:0//点击的音乐下标
    },

    onLoad: function (options) {
        // 判断是否登录
        let userInfo =wx.getStorageSync('userInfo');
        if(!userInfo){
            wx.showToast({
              title: '请先登录！',
              icon:"none",
            //   跳转到登录界面
              success:()=>{
                  wx.navigateTo({
                    url: '../login/login',
                  })
              }
            })
        }
        // 更新日期
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth()+1
        })

        // 获取每日推荐的数据
        this.getRedommendList();

        // 订阅来自songDetail页面发布的消息
        PubSub.subscribe('switchType',(msg,type)=>{
            let {recommendList,index} = this.data;
            if(type === "pre"){
                (index===0)&&(index = recommendList.length)
                index -=1;
            }else{
                (index === recommendList.length-1)&&(index=-1)
                index +=1;
            }
            this.setData({
                index:index
            })

            // PubSub.unsubscribe("switchType");
            let musicId = recommendList[index].musicId;

            PubSub.publish('musicId',musicId);
        })
    },

    async getRedommendList(){
        let recommendListData = await request('/music');
        // console.log(recommendListData);
        this.setData({
            recommendList:recommendListData.slice(0,30)
        })
        
    },

    toSongDetail(event){
        let {song,index} = event.currentTarget.dataset;
        console.log(song)
        console.log(index)
        this.setData({
            index:index
        });
        wx.navigateTo({
          url: '../songDetail/songDetail?musicId=' + song.musicId,
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // console.log("unload")
        // 注销页面时取消对SongDetail发送的订阅
        PubSub.unsubscribe('switchType');
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})