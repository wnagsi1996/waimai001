// pages/my/my.js
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const APP = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponStatistics:0, //优惠券
    userInfo:0, //用户信息
    balance:0, //余额
    score:0, //积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
     if(isLogined){
       this.getUserApiInfo()
       this.getUserAmount();
     }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  //获取用户信息
  async getUserApiInfo(){
    let res=await WXAPI.userDetail(wx.getStorageSync('token'))
    console.log(res)
    if(res.code==0){
      this.setData({
        userInfo:res.data
      })
    }
  },
  async getUserAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        balance: res.data.balance,
        score: res.data.score
      })
    }
  },
  //获取优惠券
  async couponStatistics() {
    let res= await WXAPI.couponStatistics(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        couponStatistics: res.data
      })
    }
  }
})