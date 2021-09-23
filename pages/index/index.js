import request from "../../utils/request";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList:[],
        recommendList:[],
        topList:[]
    },

  
    onLoad: async function (options) {
        // 获取轮播图
        let bannerlistData = await request("/banner");
        // 获取推荐歌单数据
        let recommendListData = await request("/playlist");

        // console.log(bannerlistData)
        // console.log(recommendListData)
        this.setData({
            bannerList:bannerlistData,
            recommendList:recommendListData
        })
        // 获取排行榜信息
        let topListData = await request("/toplist");
        console.log(topListData)
        let index = 0;
        let resultArr=[];
        while(index<4){
            let topListItemData = await request("/toplist/detail",{listId:topListData[index++].listId});
            console.log(topListItemData)
            let topListItem = {id:topListData[index-1].listId,name:topListItemData.name,tracks:topListItemData.musicList.slice(0,3),coverImgUrl:topListItemData.imageUrl};
            resultArr.push(topListItem);
            console.log(resultArr)
            this.setData({
                topList:resultArr
            })
        }

        console.log(this.data.recommendList)
        console.log(this.data.topList)
    },


    toRecommend(){
        wx.navigateTo({
          url: '../recommendSongs/recommendSongs',
        })
    },


    toMusicListDetail(event){
        let listId = event.currentTarget.id;
        console.log(listId)
        wx.navigateTo({
          url: '../musicListDetail/musicListDetail?listId=' + listId,
        })
    },


    toMusicList(){
        wx.navigateTo({
          url: '../musicList/musicList',
        })
    },


    toTopList(){
        wx.navigateTo({
          url: '../topList/topList',
        })
    },

    
    toSearch(){
        wx.navigateTo({
          url: '../search/search',
        })
    }
})