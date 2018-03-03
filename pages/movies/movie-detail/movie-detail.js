// pages/movies/movie-detail/movie-detail.js
var util = require("../../../utils/util.js")
var app = getApp();

Page({

  data: {
  
  },

  onLoad: function (options) {
    var movieId=options.id;
    var url = app.globalData.doubanBase +"/v2/movie/subject/"+movieId;
    util.http(url, this.processDoubanData);
  },

  processDoubanData:function(data){
    if(!data){
      return;
    }
    console.log(data);
    var director={
      avatar:"",
      name:"",
      id:""
    };
    if(data.directors[0]!=null){
      if (data.directors[0].avatars!=null){
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      // director.id = data.directors[0].id;
    }
    var movie={
      movieImg:data.images?data.images.large:"",
      country:data.countries[0],
      title:data.title,
      originalTitle:data.original_title,
      wishCount:data.wish_count,
      commentCount:data.comments_count,
      year:data.year,
      generes:data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score:data.rating.average,
      director:director,
      summary:data.summary,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts)
    };
    this.setData({
      movie:movie
    })

  },

  viewMoviePostImg:function(event){
    var src=event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,//当前显示图片的HTTP链接
      urls: [src]//需要预览的图片HTTP链接列表
    })
  }

 
})