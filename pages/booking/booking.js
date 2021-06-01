// pages/booking/booking.js
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    persionNum:['1-2人','3-4人','5-6人','7-8人'],
    persionNumIndex:0,
    name:'',
    phone:'',
    time:'',
    show:false,
    currentDate:new Date().getTime(),
    minDate:new Date().getTime(),
    formatter:(type, value)=>{
     switch(type){
       case 'year':
        return `${value}年`;
        break;
      case 'month':
        return `${value}月`;
        break;
      case 'day':
        return `${value}日`;
        break;
      case 'hour':
        return `${value}时`;
        break;
      case 'minute':
        return `${value}分`;
        break;
     }
    },
    filter:(type, values)=>{
      if(type=='minute'){
        return values.filter(n=>n%10==0)
      }
      return values
    }
  },
  //确认选择
  confirm(e){
    this.setData({
      time:new Date(e.detail).toLocaleString(),
      show:false
    })
  },
  _hankIndex(e){
    this.setData({
      persionNumIndex:e.currentTarget.dataset.index
    })
  },
  hideDatetimePop(){
    this.setData({
      show:false
    })
  },
  onChangeNmae(e){
    this.setData({
      name:e.detail
    })
  },
  onChangePhone(e){
    this.setData({
      phone:e.detail
    })
  },
  async _hankSubmit(){
    let name=this.data.name;
    let phone=this.data.phone;
    let time=this.data.time;
    if(name==''){
      wx.showToast({
        title: '请输入姓名',
      })
      return
    }
    let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if(phone==''){
      wx.showToast({
        title: '请输入联系电话',
      })
      return
    }else if(!reg_tel.test(phone)){
      wx.showToast({
        title: '联系号码输入有误',
      })
      return
    }
    if(time==''){
      wx.showToast({
        title: '请选择到店时间',
      })
      return
    }
    const extJsonStr = {}
    extJsonStr['姓名'] = name
    extJsonStr['联系电话'] = phone
    extJsonStr['到店时间'] = time
    extJsonStr['用餐人数'] = this.data.persionNum[this.data.persionNumIndex]
    let res=await WXAPI.yuyueJoin({
      token:wx.getStorageSync('token'),
      yuyueId: wx.getStorageSync('zxdz'),
      extJsonStr: JSON.stringify(extJsonStr)
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000);
    }
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
  //选择时间
  _hankTime(){
    this.setData({
      show:true
    })
  }
})