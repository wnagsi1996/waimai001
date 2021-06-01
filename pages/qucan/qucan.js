// pages/qucan/qucan.js
const WXAPI = require('apifm-wxapi')

const AUTH = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiOk: false,
    isLogined: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        isLogined
      })
      if(isLogined){
        this.orderList();
      }
    })
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
  _hankHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  async orderList(){
    wx.showLoading();
    let res=await WXAPI.orderList({
      token:wx.getStorageSync('token'),
      type:0,
      statusBatch: '1,2'
    });
    wx.hideLoading();
    if(res.code==0){
      this.setData({
        orderList: res.data.orderList,
        logisticsMap: res.data.logisticsMap,
        goodsMap: res.data.goodsMap,
        apiOk: true
      })
    }else{
      this.setData({
        orderList: null,
        logisticsMap: null,
        goodsMap: null,
        apiOk: true
      })
    }
  }
})