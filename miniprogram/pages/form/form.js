import areaList from './area.js'
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList,
    show: false,
    showArea: false,
    oldCitys:[],
    citys:[],
    radio: '1',
    isPut:false,
    phone:'',
    name:'',
  },
  async handleForm(){
    let citys = []
    this.data.citys.forEach((item)=>{
      citys.push(item.split('-')[0].slice(0,2))
    })
    citys = [...new Set(citys)]
    Toast('提交成功')
    if (!this.nameTest(this.data.name)){
      Toast('姓名输入错误')
      return
    }
    if(!this.phoneTest(this.data.phone)){
      Toast('手机号码输入错误')
      return
    }
    if(!citys.length){
      Toast('请选择地址')
      return
    }
      await wx.cloud.callFunction({
        name: 'updataArea',
        data: {
          citys: citys,
          isCommited:this.data.isCommited
        }
      }).then((res)=>{
        console.log(res)
      })
    await wx.cloud.callFunction({
      name: 'updataUser',
      data: {
        name:this.data.name,
        phone:this.data.phone,
        citys: this.data.citys,
        isHot: this.data.radio
      }
    })
    // app.globalData.user.passCity = [...this.data.oldCitys,...this.data.citys]
    wx.navigateBack()
  },
  //手机号验证
  phoneTest(phone){
    let mPattern = /^1[34578]\d{9}$/;
    return mPattern.test(phone)
  },
  //中文验证
  nameTest(name){
    let cnPattern = /[\u4E00-\u9FA5]/;
    return cnPattern.test(name)
  },
  delete2(e) {
    this.data.citys.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      citys: this.data.citys,
      isPut: false
    })
  },
  handleCommit(e){
    let city = ''
    let citys = this.data.citys
    e.detail.values.forEach((item)=>{
      city = city +item.name +'-'
    })
    city = city.slice(0,-1)
    citys.push(city)
    citys = [...new Set(citys)]
    this.setData({
      citys
    })
    this.setData({ show: false, showArea: false,isPut:true });
  },
  changePhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  changeName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  handleShowArea() {
    this.setData({ showArea: true });
  },
  backPage(){
    wx.navigateBack()
  },
  onClose() {
    this.setData({ show: false, showArea: false });
  },
  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name
    });
  },
  onShow(){
    this.setData({
      citys: app.globalData.user.passCity||[],
      radio: app.globalData.user.isHot +'',
      isPut: app.globalData.user.isPut,
      isCommited: app.globalData.user.isCommited
    })
  }
})