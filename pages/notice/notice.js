// pages/notice/notice.js
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html:''
  },
  // 活动信息
  async noticeLastOne(id){
    let res=await WXAPI.noticeDetail(id)
    console.log(res)
    if(res.code==0){
      this.setData({
        html:res.data.content
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    console.log(id)
    this.noticeLastOne(id)
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