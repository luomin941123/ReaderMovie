const postsData = require("../../../data/posts-data.js");
var app=getApp();
Page({

  data: {
    isPlayingMusic:false
  },

  onLoad: function (options) {
    var postId=options.id;
    this.setData({
      currentPostId:postId
    });
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    // this.data.postData = postData;

    var postsCollected = wx.getStorageSync("posts_collected");
    if (postsCollected){
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    }else{
      var postsCollected={};
      // postsCollected[postId]=false;
      for (let i = 0; i < postsData.postList.length;i++){
        postsCollected[i] = false;
      }
      wx.setStorageSync("posts_collected", postsCollected);
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic:true
      });
    }
    this.setMusicMonitor();

  },

  // 监听音乐播放状态，使得自己定义的音乐播放控件和小程序本身的总控件保持一致
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic=false;
      app.globalData.g_currentMusicPostId=null;
    });
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap:function(event){
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏变未收藏，未收藏变收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showToast: function (postsCollected, postCollected){
    //更新文章是否收藏
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定变量，从而实现图片切换
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected?"收藏成功":"取消成功",
      duration:1000,
      icon:"success"
    });
  },

  showModal: function (postsCollected, postCollected){
    var that=this;
    wx.showModal({
      title: '收藏',
      content: postCollected?"收藏该文章？":"取消收藏该文章？" ,
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确定",
      confirmColor: "#405f80",
      success:function(res){
        if(res.confirm===true){
          //更新文章是否收藏
          wx.setStorageSync("posts_collected", postsCollected);
          //更新数据绑定变量，从而实现图片切换
          that.setData({
            collected: postCollected
          });
        }
      }
    });
  },

  onShareTap:function(){
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#405f80",
      success:function(res){
        wx.showModal({
          title: '用户'+itemList[res.tapIndex],
          content: '用户是否取消？'+res.cancel+"小程序现在还无法实现分享功能"
        })
      }
    });
  },

  onMusicTap:function(){
    var isPlayingMusic=this.data.isPlayingMusic;
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.url,
        title: this.data.postData.music.title,
        coverImgUrl: this.data.postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      })
    }
  },



  
})