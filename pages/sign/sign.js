// pages/sign/sign.js
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minDate:new Date().getTime(),
    maxDate:new Date().getTime(),
    formatter:(day)=>{
      return day
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.scoreSignLogs()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    AUTH.checkHasLogined().then(islogin=>{
      if(!islogin){
        AUTH.login();
      }
    })
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
  //签到
  async sign(){
    let token=wx.getStorageSync('token');
    let res=await WXAPI.scoreSign(token);
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '签到成功',
        icon:'none'
      })
    }
    this.scoreSignLogs()
  },
  async scoreSignLogs(){
    let token=wx.getStorageSync('token');
    let res= await WXAPI.scoreSignLogs(token);
    if (res.code == 0) {
      this.setData({
        scoreSignLogs: res.data.result,
        formatter(day) {
          const _log = res.data.result.find(ele => {
            const year = day.date.getYear() + 1900
            let month = day.date.getMonth() + 1
            month = month + ''
            if (month.length == 1) {
              month = '0' + month
            }
            let date = day.date.getDate() + ''
            if (date.length == 1) {
              date = '0' + date
            }
            return ele.dateAdd.indexOf(`${year}-${month}-${date}`) == 0
          })
          if (_log) {
            day.bottomInfo = '已签到'
          }
          return day;
        }
      })
    }
  }
})