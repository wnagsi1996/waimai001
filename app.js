// app.js
const WXAPI=require('apifm-wxapi')
const AUTH=require('./utils/auth')
const CONFIG = require('config.js')
App({
  onLaunch() {
    WXAPI.init(CONFIG.subDomain)
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login()
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
