// components/test.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:4,
    total:0
  },
  lifetimes:{
    attached(){
      this.addnum()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    addnum(){
      this.setData({
        total:Number(this.data.num)+Number(this.data.list)
      })
    }
  },
  observers:{
    total:(e)=>{
      console.log(e)
    }
  }
})
