// pages/shopList/shopList.js
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    shopList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
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
    this.getLocation()
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
  //获取经纬度
  getLocation(){
    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success:(res)=>{
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.fetchShops(res.latitude, res.longitude, '')
      }
    })
  },
  //获取店铺列表
  async fetchShops(latitude,longitude,kw){
    const res = await WXAPI.fetchShops({
      curlatitude: latitude,
      curlongitude: longitude,
      nameLike: kw
    })
    if(res.code==0){
      res.data.forEach(el=>{
        el.distance = el.distance.toFixed(1) // 距离保留3位小数
      })
      this.setData({
        shopList: res.data
      })
    }
  },
  //确认搜索
  search(e){
    this.setData({
      searchValue:e.detail
    })
    this.fetchShops(this.data.latitude,this.data.longitude,e.detail);
  },
  goShop(e){
    let id=e.currentTarget.dataset.idx;
    wx.setStorageSync('shopInfo', this.data.shopList[id])
    if(this.data.type=='pay'){
      wx.navigateBack()
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }

})