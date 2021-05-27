// pages/pay/pay.js
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo:{}, //店铺信息
    goodsList:[],  //商品信息数据
    peisongType: 'zq', // 配送方式 kd,zq 分别表示快递/到店自取
    currentDate: new Date().getHours() + ':' + (new Date().getMinutes() % 10 === 0 ? new Date().getMinutes() : Math.ceil(new Date().getMinutes() / 10) * 10),
    minHour: new Date().getHours(),
    minMinute: new Date().getMinutes(),
    diningTime:0, //配送时间
    dataShow:false, //时间选择
    formatter:((type, value)=>{
      if (type === 'hour') {
        return `${value}点`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    }),
    filter(type, options) {
      if (type === 'minute') {
        return options.filter(option => option % 10 === 0);
      }
      return options;
    },
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
    this.shippingCarInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      shopInfo:wx.getStorageSync('shopInfo')
    })
    console.log(this.data.shopInfo)
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
  //切换配送
  _hankSwitch(e){
    this.setData({
      peisongType:e.currentTarget.dataset.zt
    })
    console.log(this.data.peisongType)
  },
  //获取数据
  async shippingCarInfo(){
    let token=wx.getStorageSync('token');
    let res=await WXAPI.shippingCarInfo(token);
    if(res.code==0){
      this.setData({
        goodsList:res.data.items
      })
      this.getShippingAddress()
    }else{
      wx.navigateBack();
    }
  },
  //获取地址
  async getShippingAddress(){
    let token=wx.getStorageSync('token');
    let res=await WXAPI.defaultAddress(token);
    this.setData({
      curAddressData:res.code==0?res.data.info:null
    })
    // this.processYunfei();
  },
  //跳到新增地址
  addAddress(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  //选择时间
  _hankDate(){
    this.setData({
      dataShow:true
    })
  },
  //时间变化
  diningTimeChange(a){
    const selectedHour = a.detail.getColumnValue(0).replace('点', '') * 1
    let minMinute =0;
    if (selectedHour == new Date().getHours()) {
      minMinute = new Date().getMinutes();
      // if (minMinute % 10 !== 0) {
      //   minMinute = minMinute / 10 + 1
      // }
    }
    this.setData({
      minMinute
    })
  },
  //取消时间选择
  diningTimeHide(){
    this.setData({
      dataShow:false
    })
  },
  //确认时间选择
  diningTimeConfirm(e){
    this.setData({
      diningTime: e.detail
    })
    this.diningTimeHide()
  }
})