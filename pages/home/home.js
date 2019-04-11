// pages/home/home.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/1.jpg',
      '../../images/2.jpg',
      '../../images/3.jpg'
    ],
    items: [],
    noItem: true,
    userInfo: null,
    logged: true
  },

  toItem: function(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.items[index]['id'];
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.showBusy("正在获取")
    var that = this
    wx.request({
      url: config.service.homeUrl,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.statusCode === 200) {
          wx.hideToast()
          that.setData({
            noItem: false,
            items: res.data
          })
        }
      },
      fail: function(err) {
        console.error("faild to load", err.errMsg);
      }
    })
  },

  getLocation: function() {
    var page = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // success    
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function(longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=na1ROQiIIjxHvXbhNmRoVj4gURSUGlEE&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // success 
        // console.log(res);
        var city = res.data.result.addressComponent.city;
        var province = res.data.result.addressComponent.province;
        getApp().globalData.city = city;
        getApp().globalData.province = province;
        // console.log(getApp().globalData.city);
        page.openAlert()
      },
      fail: function() {
        getApp().globalData.city = "location failed";
        getApp().globalData.province = "location failed";
      },
    })
  },
  openAlert: function() {
    wx.showModal({
      content: '请根据您所在的省份，选择一所高校，并在该校范围内进行交易',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../location/location',
          })
        }
      }
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad({})
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
    this.onLoad({})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})