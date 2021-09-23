let startY = 0;
let moveY = 0;
let moveDistance = 0;

import request from "../../utils/request";
Page({

  data: {
    coverTransform :'translateY(0)',
    coverTransition:'',
    userInfo:{},
    recentPlayList:[],
    favoriteList:[]
  },

  onShow:function(){
    // 从缓存读取用户信息
    let userInfo =  wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo:userInfo
      })
      // this.getUserRecentPlayList(this.data.userInfo.phone);
    }
  },

  // 获取最近播放
  // async getUserRecentPlayList(userId){
  //   let recentPlayListData = await request("/user/record",{uid:userId,type:0});
  //   let index = 0;
  //   let recentPlayList = recentPlayListData.allData.splice(0,10).map(item=>{
  //     item.id = index++;
  //     return item;
  //   })
  //   // console.log(recentPlayListData)
  //   this.setData({
  //     recentPlayList:recentPlayList
  //   })
  // },

  // 跳转到登录页面
  toLogin(){
    let that = this;
    if(this.data.userInfo.phone){
      wx.showModal({
        title: '注销',
        content: '确定注销登录吗？',
        success (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('cookies');
            that.setData({
              userInfo:{},
              recentPlayList:[]
            })

          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
    
  },

  handleTouchStart( event){
    startY = event.touches[0].clientY;
    this.setData({
      coverTransition:""
    })
  },

  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY-startY;
    // console.log(moveDistance);
    if(moveDistance>=80){
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
      
    })
  },
  
  handleTouchEnd(){
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coverTransition:"transform 1s linear"
    })
  },
})