// pages/login/login.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({
      /**
       * 页面的初始数据
       */
      data: {
        logged: false,
        userInfo: null,
        city: null,
        province: null,
        campus: null
      },
      userLogin: function(e) {
        const self = this
        wx.checkSession({
          success: function(res) {
            console.log("wx.checkSession调用成功")
            if (res.errMsg != "checkSession:ok")
              self.onGetUserInfo()
            else self.getUserInfoNow(e)
          },
          fail: function(res) {
            console.log("wx.checkSession调用失败")
          }
        })
      },
      getUserInfoNow: function(e) {
        const self = this
        wx.getSetting({
              success: function(res) {
                if (res.authSetting['scope.userInfo'] /* && res.authSetting['scope.userLocation'] */ ) {
                  wx.getUserInfo({
                        success(res) {
                          if (res.userInfo != undefined){
                            self.setData({
                              logged: true,
                              userInfo: res.userInfo,
                              city: res.userInfo.city,
                              province: res.userInfo.province,
                              campus: null
                            })
                            app.globalData.userInfo = res.userInfo
                            app.globalData.auth['scope.userInfo']=true
                            app.globalData.city = res.userInfo.city
                            app.globalData.province = res.userInfo.province
                            app.globalData.campus = null
                            app.globalData.logged = true
                          }
                        }
                    ,
                    fail(err) {

                    }
                })
              wx.getLocation({
                success: function(res) {

                },
                fail(err) {

                }
              })

            }
          },
          fail: function(res) {
            console.log(res.errMsg)
          }
      })
  },

  onGetUserInfo: function(e) {
    const self = this
    wx.login({
      success: function(res) {
        console.log("wx.login调用成功,获取code成功")
        wx.request({
          url: config.service.loginUrl,
          data: {
            id: 0
            //code: res.code
          },
          success: function(res) {
            console.log("openid请求成功")
            if (res.statusCode === 200) {
              console.log("获取openid成功")
              wx.setStorage(res.data)
              console.log("已保存远程认证信息")
              self.getUserInfoNow()
            } else {
              console.log("获取openid失败")
              /* 
               */
            }
          },
          fail: function(res) {
            console.err("openid请求失败", res.errMsg)
          }
        })
      },
      fail: function(res) {
        console.log("wx.login调用失败", res.errMsg)
      }
    })
  },
  _GetUserInfo: function(e) {
    // 修改全局变量
    var that = this
    // 向后端确认登录
    if (app.globalData.logged) {
      that.onLoad({})
      wx.getSetting({
        success: function(res) {
          getApp().globalData.auth = res.authSetting;
          // 如果已经授权，就加载用户信息
          if (getApp().globalData['auth']['scope.userInfo']) {
            console.log("正在加载用户信息...")

            wx.login({
              success: function(res) {
                if (res) {
                  that.globalData.userInfo = res
                } else {
                  qcloud.request({
                    url: config.service.requestUrl,
                    login: true,
                    success: function(result) {
                      that.globalData.userInfo = result.data.data
                      console.log("App.js: ", result)
                    }
                  })
                }
                wx.switchTab({
                  url: '/pages/home/home',
                  success: function(res) {
                    util.showSuccess("登录成功")
                  }
                })
              },
              fail: err => {
                console.log('Get User Failed', err)
              }
            })
          } else {
            //util.showModel("haha","你tm没登录")
            wx.authorize({
              scope: '',
            })
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
      //that.onLoad({})
    } else {
      util.showModel("登录失败", "err")
      console.log("登录失败")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (app.globalData['auth']['scope.userInfo']) {
      console.log("你已经登录了")
      that.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo,
        logged: true
      })
    }

    that.setData({
      city: app.globalData.city,
      province: app.globalData.province,
      campus: app.globalData.campus
    })

    if (!that.data.city) {
      that.setData({
        city: "当前未指定"
      })
    }
    if (!that.data.province) {
      that.setData({
        province: "当前未指定"
      })
    }
    if (!that.data.campus) {
      that.setData({
        campus: "当前未指定"
      })
    }
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