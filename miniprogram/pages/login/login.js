// pages/login/login.js
var app = getApp()
Page({
  data: {
    disabled:true,
    current:0,
    account:'',
    password:'',
    images:[
      '../../images/openEyes.png',
      '../../images/closeEyes.png'
    ]
  },
  changeAccount(e){
    this.setData({
      account: e.detail.value
    })
    this.jgDisable()
  },
  changePassword(e){
    this.setData({
      password: e.detail.value
    })
    this.jgDisable()
  },
  jgDisable(){
    if(this.data.account&&this.data.password){
      this.setData({
        disabled: false
      })
    }
    else{
      this.setData({
        disabled: true
      })
    }
  },
  changeImg(e){
    this.setData({
      current: e.currentTarget.dataset.index - 0
    })
  },
  commit(){
    wx.cloud.callFunction({
      name:'login',
      data:{
        account:this.data.account,
        password:this.data.password
      }
    }).then((res)=>{
      if(res.result.code==200){
        let data = res.result.data.data[0]
        app.globalData.user = data
        app.globalData.isLogin = true
        console.log(data)
        wx.setStorage({
          key:'_id',
          data: data._id
        })
        wx.navigateBack()
      }
    })
  }
})