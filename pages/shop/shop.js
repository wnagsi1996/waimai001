// pages/shop/shop.js
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:0,  //店铺ID
    shopInfo:{},  //店铺信息
    shopSubdetailData:{}  //店铺位置信息
  },
  //获取店铺信息
  async getShopInfo(id){
    let res=await WXAPI.shopSubdetail(id);console.log(res)
    if(res.code!=0){
      wx.showToast({
        title: '出错了',
        content:res.msg,
        showCancel: false
      })
      wx.navigateBack();
    }else{
      wx.setNavigationBarTitle({
        title: res.data.info.name,
      })
      const marker = {
        latitude: res.data.info.latitude,
        longitude: res.data.info.longitude,
        iconPath: wx.getStorageSync('mapPos'),
        height: 30,
        width: 30,
      }
      const markers = [marker];console.log(markers)
      this.setData({
        shopSubdetailData: res.data,
        shopInfo: res.data.info,
        markers
      })
    }
  },
  //打电话
  _hankpone(e){
    console.log(e)
    let phoneNumber=e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  //打开地图
  _hankOpenMap(){
    let {latitude,longitude,name,address}=this.data.shopInfo;
    wx.openLocation({
      latitude:latitude,
      longitude:longitude,
      name,
      address
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId:options.id
    })
    this.getShopInfo(options.id)
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