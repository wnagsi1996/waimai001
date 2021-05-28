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
       this.couponStatistics()
     }else{
       AUTH.authorize().then(res=>{
         AUTH.bindSeller();
       })
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
    let res= await WXAPI.couponStatistics(wx.getStorageSync('token'));
    if (res.code == 0) {
      this.setData({
        couponStatistics: res.data
      })
    }
  },
  //获取用户信息
  upadteUserInfo(){
    wx.getUserProfile({
      lang:'zh_CN',
      desc:'完善资料'
    }).then(res=>{
      console.log(res)
      this._updateUserInfo(res.userInfo)
    }).catch(err=>{
      console.log(err)
    })
  },
  //更新用户信息
 async  _updateUserInfo(userInfo){
    const postData = {
      token: wx.getStorageSync('token'),
      nick: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      province: userInfo.province,
      gender: userInfo.gender,
    }
    
    let res=await WXAPI.modifyUserInfo(postData);
    if(res!=0){
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return;
    }
    wx.showToast({
      title: '登陆成功',
    })
    this.getUserApiInfo()
  }
})