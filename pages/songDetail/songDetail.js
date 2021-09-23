import PubSub from 'pubsub-js';
import moment from 'moment'

import request from "../../utils/request";

Page({

    data: {
        isPlay:false,//音乐是否播放中
        song:[],
        musicId: "",
        musicUrl:"",
        currentTime:'00:00',
        durationTime:'00:00',
        currentWidth:0
    },


    handleSwitch(event){
        // 获取切歌的类型
        let type = event.currentTarget.id;

        this.backgroundAudioManager.stop();
        // 订阅来自recommendSong页面的musicId
        PubSub.subscribe('musicId',(msg,musicId)=>{
            // console.log(musicId);

            this.getMusicInfo(musicId);
            this.musicControl(true,musicId);

             PubSub.unsubscribe('musicId');
        })
        

        // 发布消息给recommendSongs页面
        PubSub.publish('switchType',type);
    },


    // 点击播放暂停按钮的回调函数
    handleMusicPlay(){
        
        let isPlay = !this.data.isPlay;
        let {musicId,musicUrl} = this.data;

        // 传参调用控制播放暂停函数
        this.musicControl(isPlay,musicId,musicUrl);
    },


    async getMusicInfo(musicId){
        let songData = await request('/music/detail',{musicId:musicId});
        let time = parseInt(songData.time);
        let durationTime = moment(time).format('mm:ss');
        console.log(songData)
        console.log(durationTime)
        this.setData({
            musicId:musicId,
            song:songData,
            durationTime:durationTime
        })
    },


    async musicControl(isPlay,musicId,musicUrl){
        if(isPlay){
            // appInstacne.globalData.musicId = musicId
            if(!musicUrl){
                // 获取歌曲url
                let musicUrlData = await request('/music/detail',{musicId:musicId});
                musicUrl = musicUrlData.musicUrl;

                this.setData({
                    musicUrl:musicUrl
                })
            }
           //添加歌曲url到控制对象
           this.backgroundAudioManager.src = musicUrl;
           this.backgroundAudioManager.title = this.data.song.name;
       }else{
           this.backgroundAudioManager.pause();
       }
   },


    changePlayState(isPlay){
        this.setData({
            isPlay:isPlay
        })
    },


    onLoad: function (options) {
        // 从点击事件中获取musicId
        let musicId = options.musicId;
        // console.log(musicId)
        this.setData({
            musicId:musicId
        })

        // 获取音乐信息
        this.getMusicInfo(musicId);
        // 播放音乐
        this.handleMusicPlay();
        // 修改播放状态
        this.setData({
            isPlay:true
        })

        // 创建音乐播放控制对象
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        // 监视音乐播放暂停
        this.backgroundAudioManager.onPlay(()=>{
            this.changePlayState(true)
        });
        this.backgroundAudioManager.onPause(()=>{
            this.changePlayState(false)
        });
        this.backgroundAudioManager.onStop(()=>{
            this.changePlayState(false)
        });
        this.backgroundAudioManager.onEnded(()=>{
            PubSub.subscribe('musicId',(msg,musicId)=>{
                // console.log(musicId);
                this.getMusicInfo(musicId);
                this.musicControl(true,musicId);
    
                PubSub.unsubscribe('musicId');
            })

            PubSub.publish('switchType',"next");
            
        });
        // 监听音乐播放时间
        this.backgroundAudioManager.onTimeUpdate(()=>{
            let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450;
            this.setData({
                currentTime:currentTime,
                currentWidth:currentWidth
            })
        })
    },
})