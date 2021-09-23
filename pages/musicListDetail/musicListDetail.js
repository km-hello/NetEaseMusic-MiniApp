import PubSub from "pubsub-js"

import request from "../../utils/request"


Page({

    /**
     * 页面的初始数据
     */
    data: {
        listId:"",
        musicList:[],
        index:0
    },


    onLoad: function (options) {
        let listId = options.listId;
        this.setData({
            listId:listId
        })

        if(listId[0]=='1'){
            this.getMusicList(listId)
        }else if(listId[0]=='2'){
            this.getTopList(listId)
        }
        console.log(listId)
        console.log(listId[0])

         // 订阅来自songDetail页面发布的消息
         PubSub.subscribe('switchType',(msg,type)=>{
            let musicList = this.data.musicList.musicList;
            let index = this.data.index
            if(type === "pre"){
                (index===0)&&(index = musicId.length)
                index -=1;
            }else{
                (index === musicList.length-1)&&(index=-1)
                index +=1;
            }
            this.setData({
                index:index
            })
            let musicId = musicList[index].musicId;

            PubSub.publish('musicId',musicId);
        })
    },


    async getMusicList(listId){
        let musicListData = await request('/playlist/detail',{listId:listId});
        this.setData({
            musicList:musicListData
        })
        console.log(musicListData)
    },

    async getTopList(listId){
        let musicListData = await request('/toplist/detail',{listId:listId});
        this.setData({
            musicList:musicListData
        })
        console.log(musicListData)
    },


    toSongDetail(event){
        let {song,index} = event.currentTarget.dataset;
        console.log(song)
        this.setData({
            index:index
        });
        wx.navigateTo({
          url: '../songDetail/songDetail?musicId=' + song.musicId,
        });
    },

    // onHide(){
    //     PubSub.unsubscribe('switchType');
    // },

    onUnload(){
        PubSub.unsubscribe('switchType');
    }
  
})