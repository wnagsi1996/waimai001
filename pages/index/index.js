const WXAPI=require('apifm-wxapi')
const AUTH=require('../../utils/auth')
Page({
  data:{
    menuList:[], //菜单栏列表
    activeKey:0, //当前选中
    banner:[],  //海报轮播
    scrollH:0,  //动态设置滚动高度
    iszq:true,  //是否自取
    categorySelected:{},  //当前中的分类信息
    shippingCarInfo:{}, //购物车信息
    showCartPop:false, //是否显示购物车
    latitude:0,  //经度
    longitude:0,  //纬度
    noticeLastOne:'',  //消息
    Cartshow:false,  //购物车弹窗
    detailShow:false,  //加入购物车选规格
    curGoodsMap:{},  //商品信息
    shopInfo:{} //店铺信息
  },
  onLoad:function(){
    this.getMenuList();
    this.getBanner()
    this.getGoods()
    this.getshopInfo()
    this.noticeLastOne()
    this.shippingCarInfo()
    this.scrollHeight()
  },
  // 活动信息
  async noticeLastOne(){
    let res=await WXAPI.noticeLastOne()
    if(res.code==0){
      this.setData({
        noticeLastOne:res.data
      })
      
    }
  },
  //活动点击
  _hankNoticel(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/notice/notice?id=' + id,
    })
  },
  //获取菜单导航
  async getMenuList(){
    const res = await WXAPI.goodsCategory()
    if(res.code==0){
      this.setData({
        menuList:res.data
      })
    }
  },
  //轮播广告图
  async getBanner(){
    let res=await WXAPI.banners();
    console.log(res)
    if(res.code==0){
      this.setData({
        banner:res.data
      })
    }
  },
  //获取商品信息
  async getGoods(){
    wx.showLoading({
      title:'加载中...'
    })
    let res=await WXAPI.goods({
      categoryId: this.data.categorySelected.id,
      page: 1,
      pageSize: 10000
    });
    wx.hideLoading()
    if(res.code==0){
      this.setData({
        goods:res.data,
        categorySelected:res.data[0]
      })
    }else{
      this.setData({
        goods:[],
        categorySelected:{}
      })
      
    }
  },
  //设置滚动高度
  async scrollHeight(){
    wx.getSystemInfoAsync({
      success:(res=>{
        let windowHeight=res.windowHeight;
        let screenHeight =res.screenHeight ;
        let statusBarHeight=res.statusBarHeight;
        let pixelRatio=res.pixelRatio
        const tabbarHeight = ( screenHeight - windowHeight - statusBarHeight ) * pixelRatio
        let domHeight=0
        //创建节点选择器
        var query = wx.createSelectorQuery();
        if(wx.createSelectorQuery().select('.notice')){
          wx.createSelectorQuery().select('.notice').boundingClientRect().exec( resh1=> {
            domHeight+=resh1[0].height
          })
        }
        if(this.data.showCartPop){
          wx.createSelectorQuery().select('.cart-box').boundingClientRect().exec( resh2=> {
            domHeight+=resh2[0].height;
          })
        }
        wx.createSelectorQuery().select('.header').boundingClientRect().exec( resh3=> {console.log(resh3[0].height)
          domHeight+=resh3[0].height;
          this.setData({
            scrollH: windowHeight  -statusBarHeight-domHeight
          })
        })
       
      })
    })
  },
  //切换自取外卖
  switchzq(){
    this.setData({
      iszq:!this.data.iszq
    })
  },
  //切换菜单栏
  _hankMenu(e){
    console.log(e)
    let id=e.currentTarget.dataset.idx;
    let categorySelected=this.data.menuList[id]
    this.setData({
      activeKey:id,
      categorySelected
    })
    this.getGoods()
  },
  //加入购物车
  async addCart(e){
    let token=wx.getStorageSync('token');
    let index=e.currentTarget.dataset.idx;
    let item = this.data.goods[index];
    let res=await WXAPI.shippingCarInfoAddItem(token,item.id,item.minBuyNumber, []);
    if(res.code==200){
      AUTH.login(thhis);
      return
    }
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
      return
    }
    this.shippingCarInfo()
  },
  //加入购物车
  async _hankaddCar(){
    const token = wx.getStorageSync('token')
    const curGoodsMap = this.data.curGoodsMap
    const canSubmit = this.skuCanSubmit()
    const additionCanSubmit = this.additionCanSubmit()
    if (!canSubmit || !additionCanSubmit) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }
    let sku=[];
    if (curGoodsMap.properties) {
      curGoodsMap.properties.forEach(n => {
        let small=n.childsCurGoods.find(ele=>ele.selected)
        sku.push({
          optionId: n.id,
          optionValueId: small.id
        })
      })
    }
     let goodsAddition = []
    // if (curGoodsMap.basicInfo.hasAddition) {
    //   this.data.goodsAddition.forEach(ele => {
    //     ele.items.forEach(item => {
    //       if (item.active) {
    //         goodsAddition.push({
    //           id: item.id,
    //           pid: item.pid
    //         })
    //       }
    //     })
    //   })
    // }
    let res = await WXAPI.shippingCarInfoAddItem(token, curGoodsMap.basicInfo.id, curGoodsMap.number, sku, goodsAddition)
    if(res.code==2000){
      // this.hideGoodsDetailPOP()
      AUTH.login(this)
      return
    }
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showTabBar()
    this.onClose()
    this.shippingCarInfo()
  },
  additionCanSubmit() {
    const curGoodsMap = this.data.curGoodsMap
    let canSubmit = true
    if (curGoodsMap.basicInfo.hasAddition) {
      this.data.goodsAddition.forEach(ele => {
        if (ele.required) {
          const a = ele.items.find(item => item.active)
          if (!a) canSubmit = false
        }
      })
    }
    return canSubmit
  },
  //读取购物车信息
  async shippingCarInfo(){
    let res=await WXAPI.shippingCarInfo(wx.getStorageSync('token'));
    console.log(res)
    if(res.code==700){
      this.setData({
        shippingCarInfo: null,
        showCartPop: false
      })
    }else if(res.code==0){
      this.setData({
        shippingCarInfo: res.data,
        showCartPop: true
      })
    }else{
      this.setData({
        shippingCarInfo: null,
        showCartPop: false
      })
    }
    this.scrollHeight()
  },
  //显示购物车
  _hankShowCart(){
    this.setData({
      Cartshow:true
    })
  },
  // 购物车数量改变
 async _handCartNum(e){
    let token=wx.getStorageSync('token')
    let id= e.currentTarget.dataset.idx;
    let item=this.data.shippingCarInfo.items[id];
    if(item){
      wx.showLoading();
      if(e.detail<1){
        let res=await WXAPI.shippingCarInfoRemoveItem(token,item.key);
        wx.hideLoading()
        if(res.code==700){
          this.setData({
            shippingCarInfo: null,
            showCartPop: false
          })
        }else if(res.code==0){
          this.setData({
            shippingCarInfo: res.data
          })
        }else {
          this.setData({
            shippingCarInfo: null,
            showCartPop: false
          })
        }
      }else{
        let res=await WXAPI.shippingCarInfoModifyNumber(token,item.key,e.detail);
        wx.hideLoading()
        if(res.code!=0){
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
          return
        }
        this.shippingCarInfo()
      }
    }
  },
  //清空购物车
  async _hankDelCart(){
    let token=wx.getStorageSync('token');
    wx.showLoading();
    let res=await WXAPI.shippingCarInfoRemoveAll(token);
    wx.hideLoading();
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
      return;
    }
    this.setData({
      Cartshow:false
    })
   this.shippingCarInfo();
  },
  //关闭购物车
  onClose(){
    this.setData({
      Cartshow:false,
      detailShow:false
    })
    wx.showTabBar()
  },
  //点击购买弹出
  async _goodsAddition(e){
    let index=e.currentTarget.dataset.idx;
    let goodsId=this.data.goods[index].id
    const token = wx.getStorageSync('token')
    const res = await WXAPI.goodsDetail(goodsId)
    if(res.code!=0){
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
      return
    }
    
    res.data.price=res.data.basicInfo.minPrice;
    res.data.number=res.data.basicInfo.minBuyNumber;

    const res1 = await WXAPI.goodsAddition(goodsId);
    this.setData({
      goodsAddition:res1.code==0? res1.data:null,
      curGoodsMap: res.data,
      detailShow:true
    })
    wx.hideTabBar();
  },
  //点击sku
  _hankSku(e){
    const index1 = e.currentTarget.dataset.idx1
    const index2 = e.currentTarget.dataset.idx2
    const curGoodsMap = this.data.curGoodsMap
    curGoodsMap.properties[index1].childsCurGoods.forEach(ele=>{
      ele.selected = false
    })
    curGoodsMap.properties[index1].childsCurGoods[index2].selected = true
    console.log(curGoodsMap)
    this.setData({
      curGoodsMap
    })
    this.calculateGoodsPrice()
  },
  async calculateGoodsPrice() {
    const curGoodsMap = this.data.curGoodsMap
    // 计算最终的商品价格
    let price = curGoodsMap.basicInfo.minPrice
    let originalPrice = curGoodsMap.basicInfo.originalPrice
    let totalScoreToPay = curGoodsMap.basicInfo.minScore
    let buyNumMax = curGoodsMap.basicInfo.stores
    let buyNumber = curGoodsMap.basicInfo.minBuyNumber
    // 计算sku价格
    const canSubmit = this.skuCanSubmit()
    if(canSubmit){
      let propertyChildIds = "";
      if (curGoodsMap.properties) {
        curGoodsMap.properties.forEach(n => {
          let small = n.childsCurGoods.find(ele => ele.selected)
          propertyChildIds = propertyChildIds + n.id + ":" + small.id + ","
        })
      }
      let res = await WXAPI.goodsPrice(curGoodsMap.basicInfo.id, propertyChildIds)
      if (res.code == 0) {
        price=res.data.price;
        originalPrice = res.data.originalPrice
        totalScoreToPay = res.data.score
        buyNumMax = res.data.stores
      }
    }
    curGoodsMap.price = price
      this.setData({
        curGoodsMap
      });
  },
  //判断有没有该sku
  skuCanSubmit() {
    const curGoodsMap = this.data.curGoodsMap
    let canSubmit = true
    if(curGoodsMap.properties){
      curGoodsMap.properties.forEach(n => {
        let small = n.childsCurGoods.find(ele => ele.selected)
        if(!small){
          canSubmit= false
        }
      })
    }
    return canSubmit
  },
  //获取店铺经度纬度位置信息
  getshopInfo(){
    wx.getLocation({
      type: 'wgs84',
      success :(res)=> {
        this.setData({
          latitude:res.latitude, //经度
          longitude:res.longitude  //纬度
        })
        this.fetchShops(res.latitude,res.longitude)
      }
     })
  },
  //获取店铺具体信息
  async fetchShops(latitude,longitude,kw=''){
    let res=await WXAPI.fetchShops({
      curlatitude:latitude,
      curlongitude:longitude,
      nameLike:kw,
      pageSize:1
    })
    if(res.code==0){
      res.data[0].distance=(res.data[0].distance).toFixed(2);
      this.setData({
        shopInfo:res.data[0]
      })
      wx.setStorageSync('shopInfo', res.data[0])
    }
  },
  topay(){
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  }
})