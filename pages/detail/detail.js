// pages/detail/detail.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    receiver: null,
    itemID: null,
    imgUrls: [],
    existedComment: [],
    price: '100',
    title: '商品名称',
    discription: '商品信息',
    collectcomment: null,
    isReply: false,
    inputFocus: false,
    receiver: "15" //default null replyer
  },

  /**
   * 输入监视函数
   */
  //start pushComment
  collectComment: function(e) {
    this.setData({
      pushcomment: e.detail.value
    })
  },
  //complete pushComment

  /**
   * 发送回复的跳转函数
   */
  sendReply: function(event) {
    var that = this;
    that.setData({
      receiver: event.target.dataset.id,
      isReply: true,
      inputFocus: true
    })
    console.log("即将回复给： " + that.data.receiver)
  },


  /**
   * 发送绑定函数
   */
  //start sendComment
  sendComment: function(event) {
    if (app.globalData.logged) {


      var that = this;
      console.log(event)
      let to_id = event.target.dataset.id
      if (event.target.dataset.isReply == false) {
        to_id = 15
      }
      let commentBody = {
        "CommenterId": {
          "Id": 0,
          "Nickname": app.globalData.userInfo.nickName,
          "Avatar": app.globalData.userInfo.avatorimageUrl
        },
        "Receiver": {
          "Id": 1,
          "Nickname": "Nickname of Receiver"
        },
        "Context": that.data.pushcomment
      }
      console.log(commentBody)
      //TODO:POST the body
      wx.request({
        url: config.service.addComment,
        headers: {
          'Content-Type': "application/json"
        },
        method: "POST",
        login: true,
        data: commentBody,
        success: function(res) {
          if (res.statusCode == 200) {
            util.showSuccess("评论成功")
            console.log("好像成功了", res.statusCode, res.header, res.data)
            that.onPullDownRefresh()
          } else {
            console.warn("评论返回值不正确", res.data)
          }
        },
        fail: function(err) {
          util.showModel("失败！")
          console.error("评论失败" + err)
        }
      })
    }
    else {
        wx.navigateTo({
          url: '../login/login',
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      itemID: options.id
    })
    var url_detail = config.service.detailUrl + '/' + options.id
    //request for detail
    wx.request({
      url: url_detail,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.statusCode === 200) {
          wx.hideToast()
          var image = res.data[0].Image
          for (let i = 0; i < image.length; ++i) {
            image[i] = config.service.imageUrl + image[i]
          }
          that.setData({
            itemID: options.id,
            imgUrls: image,
            price: res.data[0].Price,
            title: res.data[0].Title,
            discription: res.data[0].Detail
          })
        } else {
          wx.showModal({
            title: "失败",
            showCancel: false,
            confirmText: "确定",
            confirmColor: "#0f0",
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        }

      },
      fail: function(err) {
        util.showModel("载入失败", err)
        console.log("获取失败", err)
      }
    })

    //request for existedComment
    wx.request({
      url: config.service.allComment + '/' + options.id,
      success: function(res) {
        if (res.statusCode === 200) {
          let temp = []
          let comments = res.data[0].comments
          for (let i in comments) {
            console.log(comments[i])
            comments[i].CommenterId.Avatar = config.service.avatorimageUrl + comments[i].CommenterId.Id + ".jpg"
            temp.push(comments[i])
          }
          that.setData({
            existedComment: temp
          })
        }
      },
      fail: function(err) {
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    util.showBusy("正在刷新")
    let options = {
      id: this.data.itemID
    }
    this.onLoad(options)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    /**
     * TODO:下拉继续加载评论
     */
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})