// pages/youhui/youhui.js
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    rechargeSendRules:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    WXAPI.payBillDiscounts().then(res => {console.log(res)
      if (res.code === 0) {
        this.setData({
          rechargeSendRules: res.data
        });
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
    this.setData({
      shopInfo:wx.getStorageSync('shopInfo')
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

  },
  async _hankFk(){
    let money=this.data.money;
    if(money=='' || money==0){
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
      return
    }
    const userMoney = await WXAPI.userAmount(wx.getStorageSync('token'))
    if(userMoney.code==2000){
      AUTH.login(this)
      return
    }
    if (userMoney.code != 0) {
      wx.showToast({
        title: userMoney.msg,
        icon: 'none'
      })
      return
    }
    //无权限没办法写支付
  }
})