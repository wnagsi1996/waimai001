// pages/coupons/coupons.js
const APP = getApp()
const AUTH = require('../../utils/auth')
const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupons()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  async getCoupons(){
    wx.showLoading();
    let res=await WXAPI.coupons({
      token:wx.getStorageSync('token')
    })
    wx.hideLoading();
    this.setData({
      coupons:res.code==0?res.data.filter(n=>!n.pwd):null
    })
  },
  //点击tab
  onChange(e){
    this.setData({
      tabIndex:e.detail.index
    })
    if(e.detail.index==0){
      this.getCoupons()
    }else{
      this.mycoupons()
    }
  },
  // 我的抵用券
  async mycoupons(){
    wx.showLoading();
    let status='0';
    if(this.data.tabIndex==2){
      status='1,2,3'
    }
    let res=await WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status
    })
    wx.hideLoading();
    if(res.code==0){
      res.data.forEach(n=>{
        n.dateEnd=n.dateEnd.split(' ')[0]
      })
      this.setData({
        mycoupons: res.data
      })
    }else{
      this.setData({
        mycoupons: null
      })
    }
  },
  async fetchCounpon(e){
    const idx = e.currentTarget.dataset.idx
    const coupon = this.data.coupons[idx]
    const res = await WXAPI.fetchCoupons({
      id: coupon.id,
      token: wx.getStorageSync('token')
    })
    if (res.code == 20001 || res.code == 20002) {
      wx.showToast({
        title: '来晚了',
        icon: 'none'
      })
      return;
    }
    if (res.code == 20003) {
      wx.showToast({
        title: '你领过了，别贪心哦',
        icon: 'none'
      })
      return;
    }
    if (res.code == 30001) {
      wx.showToast({
        title: '您的积分不足',
        icon: 'none'
      })
      return;
    }
    if (res.code == 20004) {
      wx.showToast({
        title: '已过期',
        icon: 'none'
      })
      return;
    }
    if (res.code == 0) {
      wx.showToast({
        title: '领取成功',
        icon: 'success'
      })
      setTimeout(() => {
        this.coupons()
      }, 1000);
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  }
})