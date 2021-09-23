import request from "../../utils/request"

import PubSub from "pubsub-js"


Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchContent:"",
        searchResult:[],
        index :0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let searchContent = options.searchContent;

        // 发请求获取关键字模糊匹配数据
        let searchResultData = await request('/music/search', {name: searchContent});
        this.setData({
            searchResult: searchResultData
        })


        // 订阅来自songDetail页面发布的消息
        PubSub.subscribe('switchType',(msg,type)=>{
            let {searchResult,index} = this.data;
            if(type === "pre"){
                (index===0)&&(index = searchResult.length)
                index -=1;
            }else{
                (index === searchResult.length-1)&&(index=-1)
                index +=1;
            }
            this.setData({
                index:index
            })

            // PubSub.unsubscribe("switchType");
            let musicId = searchResult[index].musicId;

            PubSub.publish('musicId',musicId);
        })
    },

    toSongDetail(event){
        let {song,index} = event.currentTarget.dataset;
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