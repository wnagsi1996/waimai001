// pages/allOrder/allOrder.js
const AUTH=require('../../utils/auth');
const WXAPI=require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    AUTH.checkHasLogined().then(islogin=>{
      if(islogin){
        this.getOrderdata();
      }else{
        wx.showModal({
          content: '登陆后才能访问',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
      }
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
  //获取订单数据
  async getOrderdata(){
    wx.showLoading();
    let token=wx.getStorageSync('token')
    let res=await WXAPI.orderList({token});
    wx.hideLoading();
    if(res.code==0){
      let orderlist=res.data.orderList;
      orderlist.forEach(n=>{
        if(n.status==1 && n.isNeedLogistics){
          n.statusStr='配送中'
        }
        if (n.status == 1 && !n.isNeedLogistics) {
          n.statusStr = '待取餐'
        }
        if (n.status == 3) {
          n.statusStr = '已完成'
        }
      })
      this.setData({
        orderList:orderlist,
        logisticsMap:res.data.logisticsMap,
        goodsMap: res.data.goodsMap,
        apiOk: true
      })
    }else{
      this.setData({
        orderList:null,
        logisticsMap:{},
        goodsMap: {},
        apiOk: true
      })
    }
  },
  //联系商家
  async _hankShopPhone(e){
    let shopId=e.currentTarget.dataset.shopid
    let res=await WXAPI.shopSubdetail(shopId);
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: res.data.info.linkPhone
    })
  },
  //关闭订单
  async _hankOrderClose(){
    let id=e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success:(res)=>{
        if (res.confirm) {
          WXAPI.orderClose(wx.getStorageSync('token'), orderId).then(function(res) {
            if (res.code == 0) {
              this.getOrderdata();
            }
          })
        }
      },
      //支付
      async _hankPay(){
        let id=e.currentTarget.dataset.id;
      }
    })
  },
  //删除订单
  async deleteOrder(e){
    let orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
      success:(res)=>{
        if (res.confirm) {
          WXAPI.orderDelete(wx.getStorageSync('token'), id).then(res=>{  
            if (res.code == 0) {
              this.onShow(); //重新获取订单列表
            }    
          })          
        }
      }
    })
  }
})