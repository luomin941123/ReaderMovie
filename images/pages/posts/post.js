const postData=require("../../data/posts-data.js");

Page({

  data: {},

  onLoad: function () {
    this.setData({
        posts_key:postData.postList
      });
  },

  onPostTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    wx.navigateTo({
      url:"post-detail/post-detail?id="+postId
    });
  },

  onSwiperTap:function(event){
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    });
  }

})