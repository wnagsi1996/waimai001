// pages/orderDetail/orderDetail.js
const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderDetail:'',//订单详情
    shopSubdetail:'' //店铺信息
  },
  async orderDetail() {
      const res = await WXAPI.orderDetail(wx.getStorageSync('token'), this.data.orderId)
      if (res.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return
      }
      // 绘制核销码
      if (res.data.orderInfo.hxNumber && res.data.orderInfo.status == 1) {
        wxbarcode.qrcode('qrcode', res.data.orderInfo.hxNumber, 400, 400);
      }        
      this.setData({
        orderDetail: res.data
      })
      if (res.data.orderInfo.shopIdZt) {
        this.shopSubdetail()
      }
    },
    async shopSubdetail() {
      const res = await WXAPI.shopSubdetail(this.data.orderDetail.orderInfo.shopIdZt)
      if (res.code == 0) {
        this.setData({
          shopSubdetail: res.data
        })
      }
    },
    _hankPhone(e){
      wx.makePhoneCall({
        phoneNumber: this.data.shopSubdetail.info.linkPhone,
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      orderId: e.id
    })
    this.orderDetail()
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