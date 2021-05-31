// components/slider/slider.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //容器宽度
    areaWidth:{
      type:Number,
      value:750
    },
    //滑动显示的区域宽度
    delWidth:{
      type:Number,
      value:150
    },
    //高度
    areaHeight:{
      type:Number,
      value:150
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    x:0,
    mx:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindtouchstart(e){
      this.setData({
        mx:e.changedTouches[0].pageX
      })
    },
    bindtouchend(e){
      let newx=e.changedTouches[0].pageX
      let canum=newx-this.data.mx
      if(canum<0){
        this.setData({
          x:canum<-30?`-${this.data.delWidth}`:0
        })
      }else{
        this.setData({
          x:canum>30?0:`-${this.data.delWidth}`
        })
      }
    }
  } 
})
