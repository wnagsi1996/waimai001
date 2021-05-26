const WXAPI = require('apifm-wxapi')
import Dialog from '@vant/weapp/dialog/dialog'

//判断登录状态是否过期
async function checkSession(){
  return new Promise((resolve,reject)=>{
    wx.checkSession({
      success:()=>{
        return resolve(true)
      },
      fail:()=>{
        return resolve(false)
      }
    })
  })
}
//绑定卖家
async function bindSeller(){
  const token=wx.getStorageSync('token');
  const referrer=wx.getStorageSync('referrer');
  if(!token){
    return 
  }
  if (!referrer) {
    return
  }
  const res = await WXAPI.bindSeller({
    token,
    uid: referrer
  })
}

//检测登录状态，返回 true / false
async function checkHasLogined(){
  const token=wx.getStorageSync('token');
  if(!token){
    return false
  }
  const loggined=await checkSession();
  if(!loggined){
    wx.removeStorageSync('token');
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

//获取接口获取登录凭证
async function loginCode(){
  return new Promise((resolve,reject)=>{
    wx.login({
      success:(res)=>{
        return resolve(res)
      },
      fail:()=>{
        wx.showToast({
          title: '获取Code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}

//登录
function login(page){
  return new Promise((resolve,reject)=>{
    wx.login({
      success:async (res)=>{
        const componentAppid = wx.getStorageSync('componentAppid')
        let resp='';
        if(componentAppid){
          resp=await WXAPI.wxappServiceLogin({
            componentAppid,
            appid:wx.getStorageSync('appid'),
            code: res.code
          });
        }else{
          resp=await WXAPI.login_wx(res.code);
        }
        if(resp.code==10000){
          //去注册
          return;
        }
        if(resp.code!=0){
          //登录错误
          wx.showToast({
            title: '无法登录',
            content:resp.msg,
            showCancel: false
          })
          return;
        }
        wx.setStorageSync('token', resp.data.token)
        wx.setStorageSync('uid', resp.data.uid)
        this.bindSeller();
        if(page){
          page.onShow()
        }
      }
    })
  })
}

//注册
function authorize() {
  return new Promise((resolve,reject)=>{
    wx.login({
      success:async (res)=>{
        const code=res.code;
        let referrer=''; //推荐人
        let referrer_storge=wx.getStorageInfoSync('referrer');
        if(referrer_storge){
          referrer=referrer_storge
        }
         // 下面开始调用注册接口
         const componentAppid = wx.getStorageSync('componentAppid')
         let resp='';
         if(componentAppid){
           resp=await  WXAPI.wxappServiceAuthorize({code,referrer });
         }else{
          resp=await WXAPI.authorize({code,referrer })
         }
         if (resp.code == 0) {
          wx.setStorageSync('token', resp.data.token)
          wx.setStorageSync('uid', resp.data.uid)
          resolve(resp)
        }else{
          wx.showToast({
            title:resp.msg,
            icon:'none'
          })
          reject(resp.msg)
        }
      }
    })
  })
}

//退出登录
async function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}

//判断是否有权限执行某功能
async function checkAndAuthorize (scope) {
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success:(res)=>{
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: 'scope',
            success:()=>{
              resolve() //无返回参数
            },
            fail:(e)=>{
              wx.showModal({
                title:'无权操作',
                content:'需要获得您的授权',
                showCancel:false,
                confirmText:'立即授权',
                confirmColor: '#e64340',
                success:(e)=>{
                  wx.openSetting();
                },
                fail:(e)=>{
                  reject(e)
                }
              })
            }
          })
        }
      }
    })
  })
}

module.exports={
  checkSession,
  bindSeller,
  checkHasLogined,
  loginCode,
  login,
  authorize,
  loginOut,
  checkAndAuthorize
}
