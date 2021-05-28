// pages/address/address.js
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressNull:false,  //是否有地址数据
    addressEdit:false,  //是否编辑
    addressList:[],  //地址数据
   //地址编辑数据
    address:{
      name:'',
      nameerr:'',
      phoneNumber:'',
      phoneNumbererr:'',
      address:'',
      addresserr:'',
      addressinfo:'',
      addressinfoerr:'',
    },
    sheng:'',  //省
    shi:'',  //市
    xian:'',  //县
    pickerRegionRange:{},  //三联省市县数据
    pickerSelect:[],  //选中的数据
    id:'' , //地址ID
  },
  //新增地址按钮
  _hankAddAddress(){
    this.setData({
      id:'',
      addressEdit:true,
      addressNull:false
    })
  },
  //删除地址
 async  _hankdelAddress(){
    let res=await WXAPI.deleteAddress(wx.getStorageSync('token'), this.data.id);
    if(res.code==0){
      this.setData({
        addressNull:true,
        addressEdit:false
      })
      this.initShippingAddress()
    }
  },
  //选完地址后退e
  selectTap(e){
    var id = e.currentTarget.dataset.id;
    WXAPI.updateAddress({
      token: wx.getStorageSync('token'),
      id: id,
      isDefault: 'true'
    }).then(function(res) {
      wx.navigateBack({})
    })
  },
  bindchange(e){
    let attr=e.detail.value;
    let pickerRegionRange=this.data.pickerRegionRange
    let sheng=pickerRegionRange[0][attr[0]]
    let shi=pickerRegionRange[1][attr[1]]
    let xian=pickerRegionRange[2][attr[2]]
    let address=this.data.address;
    address.address=sheng.name+' '+shi.name+' '+xian.name;
    this.setData({
      address,
      shi,
      sheng,
      xian,
      pickerSelect:attr
    })
  },
   // 省市选择器 三栏
   initRegionPicker () {
    WXAPI.province().then(res => {
      if (res.code === 0) {
        let _pickerRegionRange = []
        _pickerRegionRange.push(res.data)
        _pickerRegionRange.push([{ name: '请选择' }])
        _pickerRegionRange.push([{ name: '请选择' }])
        this.data.pickerRegionRange = _pickerRegionRange
        this.bindcolumnchange({ detail: { column: 0, value: 0 } })
      }
    })
  },
  bindcolumnchange: function(e) {
    const column = e.detail.column
    const index = e.detail.value    
    const regionObject = this.data.pickerRegionRange[column][index]    
    if (column === 2) {
      this.setData({
        pickerRegionRange: this.data.pickerRegionRange
      })
      return
    }
    if (column === 1) {
      this.data.pickerRegionRange[2] = [{ name: '请选择' }]
    }
    if (column === 0) {
      this.data.pickerRegionRange[1] = [{ name: '请选择' }]
      this.data.pickerRegionRange[2] = [{ name: '请选择' }]
    }
    // // 后面的数组全部清空
    // this.data.pickerRegionRange.splice(column+1)
    // 追加后面的一级数组
    WXAPI.nextRegion(regionObject.id).then(res => {
      if (res.code === 0) {
        this.data.pickerRegionRange[column + 1] = res.data     
      }
      this.bindcolumnchange({ detail: { column: column + 1, value: 0 } })
    })
  },  
  bindRegionChange(){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },
  //前往地图
  _hanktomap(){
    wx.chooseLocation({
      success:(res)=>{
        let address=this.data.address;
        address.addressinfo=res.address;
        address.latitude = res.latitude
        address.longitude = res.longitude
        this.setData({
          address
        })
      }
    })
  },
  //保存地址
  async _hankSave(){
    let sheng=this.data.sheng
    let shi=this.data.shi
    let xian=this.data.xian
    let address=this.data.address;
    let id=this.data.id
    if(address.name==''){
      wx.showToast({
        title: '请输入用户名',
      })
      return
    }
    if(address.phoneNumber){
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if(!reg.test(address.phoneNumber)){
        wx.showToast({
          title: '手机号码不正确',
        })
        return
      }
    }
    if(address.address==''){
      wx.showToast({
        title: '请选择地区',
      })
      return
    }
    if(address.addressinfo==''){
      wx.showToast({
        title: '请填写详细地址',
      })
      return
    }
    
    let postData = {
      token: wx.getStorageSync('token'),
      linkMan: address.name,
      address: address.addressinfo,
      mobile: address.phoneNumber,
      isDefault: 'true',
      latitude:address.latitude,
      longitude:address.longitude,
      provinceId:sheng.id,
      cityId:shi.id,
      districtId:xian.id,
      id
    }    
    wx.showLoading()
    let res=''
    if(id!=''){
      res=await WXAPI.updateAddress(postData)
    }else{
      res=await WXAPI.addAddress(postData)
    }
    wx.hideLoading()
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }else{
      Object.keys(address).forEach(n=>address[n]='')
      this.setData({
        addressEdit: false,
        address
      })
      
      this.initShippingAddress()
    }
  },
  //地址编辑
  _hankEdit(e){
    let item=e.currentTarget.dataset.item;
    let address=this.data.address;
    address.name=item.linkMan
    address.phoneNumber=item.mobile
    address.address=item.provinceStr+item.cityStr+item.areaStr
    address.addressinfo=item.address
    Object.assign(address,item)
    this.setData({
      address,
      id:item.id,
      addressEdit:true,
      addressNull:true
    })
  },
  //地址获取
  async initShippingAddress(){
    let res=await WXAPI.queryAddress(wx.getStorageSync('token'));console.log(res)
    this.setData({
      addressList:res.code==0?res.data:null,
      addressNull:res.data?false:true
    })
  },
  //用户名输入
  usernameInp(e){
    let address=this.data.address;
    if(!e.detail.value){
      address.nameerr='请输入用户名'
      this.setData({
        address
      })
    }else{
      address.name=e.detail.value
      this.setData({
        address
      })
    }
  },
  //详细地址
  addressInfoInp(e){
    let address=this.data.address;
    if(!e.detail.value){
      address.addressinfoerr='请输入详细地址'
      this.setData({
        address
      })
    }else{
      address.addressinfo=e.detail.value
      this.setData({
        address
      })
    }
  },
  //手机号码输入
  phoneInp(e){
    let address=this.data.address;
    if(!e.detail.value){
      address.phoneNumbererr='请输入手机号码'
      this.setData({
        address
      })
    }else{
      address.phoneNumber=e.detail.value
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if(!reg.test(e.detail.value)){
        address.phoneNumbererr='手机号码格式错误'
      }else{
        address.phoneNumbererr=''
      }
      this.setData({
        address
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRegionPicker();
    this.initShippingAddress()
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