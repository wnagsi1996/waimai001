// pages/branceDetail/branceDetail.js
const WXAPI = require('apifm-wxapi')
Page({
  async cashLogsV2() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cashLogsV2({
      token: wx.getStorageSync('token'),
      page:1,
      pageSize:500
    })
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        cashLogsV2: res.data.result
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cashLogsV2()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})