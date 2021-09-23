import request from "../../utils/request";

Page({

    data: {
        videoGroupList:[],
        navId:null,
        videoList:[],
        videoId:"",
        isTriggered:false
    },
    onLoad:function(){

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
        this.getVideoGroupListData();
    },

    async getVideoGroupListData(){
        let videoGroupListData = await request('/video/group/');
        this.setData({
            videoGroupList:videoGroupListData.slice(0,10),
            navId:videoGroupListData[0].groupId
        });
        this.getVideoList(this.data.navId)

    },

    async getVideoList(navId){
        let videoListData = await request("/video/list",{groupId:navId});
        console.log(videoListData)
        this.setData({
            videoList:videoListData,
            isTriggered:false
        })
        // let videoIdData=[];
        // videoListData.datas.forEach(element => {
        //     videoIdData.push(element.data.vid)
        // });
        // // 通过vid获取视频url并添加到videoListData
        // let index = 0;
        // while(index<videoIdData.length){
        //     let url = await request('/video/url',{id:videoIdData[index++]});
        //     videoListData.datas[index-1].data.url = url.urls[0].url;
        //     // 关闭下拉刷新
        //     this.setData({
        //         isTriggered:false,
        //         vidoeList:videoListData.datas
        //     })
        // }
        // // 关闭加载框
        wx.hideLoading();
    },

    changeNav(event){
        //console.log(event)
        let id = event.currentTarget.id;
        this.setData({
            navId:id,
            vidoeList:[]
        })

        wx.showLoading({
          title: '加载中...',
        })
        this.getVideoList(this.data.navId);
    },
    handlePlay(event){
        let vid = event.currentTarget.id;//获取当前播放视频的Id
        // this.vid !== vid && this.vidoeContext&&this.vidoeContext.stop();//关闭上一个视频
        // this.vid = vid;
        this.setData({
            videoId:vid
        })
        // this.vidoeContext = wx.createVideoContext(vid);//创建控制video的对象实例
        // this.vidoeContext.play();
    },

    toSearch(){
        wx.navigateTo({
          url: '../search/search',
        })
    },

    handleRefresher(){
        this.getVideoList(this.data.navId);
    },

})