//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('utils/util.js')

//app.js
App({
  globalData: {
    userInfo: null,
    auth: {
      'scope.userInfo': false
    },
    city: null,
    province: null,
    campus: null,
    logged: false
  },
  onLaunch: function () {

  }
})