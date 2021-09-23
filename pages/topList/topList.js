import request from "../../utils/request"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
         // 获取排行榜信息
         let topListData = await request("/toplist");
         console.log(topListData)
         let index = 0;
         let resultArr=[];
         while(index<10){
             let topListItemData = await request("/toplist/detail",{listId:topListData[index++].listId});
            //  console.log(topListItemData)
             let topListItem = {id:topListData[index-1].listId,name:topListItemData.name,tracks:topListItemData.musicList.slice(0,3),coverImgUrl:topListItemData.imageUrl};
             resultArr.push(topListItem);
             this.setData({
                 topList:resultArr
             })
         }
         console.log(this.data.topList)
    },

    toMusicListDetail(event){
        let listId = event.currentTarget.id;
        // console.log(listId)
        wx.navigateTo({
          url: '../musicListDetail/musicListDetail?listId=' + listId,
        })
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