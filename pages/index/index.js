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
    noticeLastOne:''  //消息
  },
  onLoad:function(){
    this.getMenuList();
    this.getBanner()
    this.getGoods()
    this.scrollHeight()
    this.getshopInfo()
    this.noticeLastOne()
  },
  // 活动信息
  async noticeLastOne(){
    let res=await WXAPI.noticeLastOne()
    console.log(res)
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
        if(query.select('.notice')){
          query.select('.header').boundingClientRect().exec( resh=> {
            domHeight+=resh[0].height
          })
        }
        query.select('.header').boundingClientRect().exec( resh=> {
          domHeight+=resh[0].height;
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
        shippingCarInfo: res.data
      })
    }else{
      this.setData({
        shippingCarInfo: null,
        showCartPop: false
      })
    }
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
  async fetchShops(latitude,longitude,kw){
    let res=await WXAPI.fetchShops({
      curlatitude:latitude,
      curlongitude:longitude,
      nameLike:kw,
      pageSize:1
    })
    console.log(res)
  }
})