const WXAPI=require('apifm-wxapi');

// 显示购物车数量
function showCartNum(){
  return new Promise((resolve,reject)=>{
    const token=wx.getStorageSync('token');
    if(!token){
      return;
    }

    WXAPI.shippingCarInfo(token).then(res=>{
      if (res.code == 700) {
        wx.removeTabBarBadge({
          index: 2
        });
      }
      if(res.code==0){
        if (res.data.number == 0) {
          wx.removeTabBarBadge({
            index: 1
          });
        }else{
          wx.setTabBarBadge({
            index: 1,
            text: `${res.data.number}`
          })
        }
      }
    })
  })
}
module.exports={
  showCartNum
}