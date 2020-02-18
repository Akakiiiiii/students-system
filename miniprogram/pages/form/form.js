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
    isPut:false
  },
  async handleForm(){
    let citys = []
    this.data.citys.forEach((item)=>{
      citys.push(item.split('-')[0].slice(0,2))
    })
    citys = [...new Set(citys)]
    Toast('提交成功')
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
        citys: this.data.citys,
        isHot: this.data.radio
      }
    })
    // app.globalData.user.passCity = [...this.data.oldCitys,...this.data.citys]
    wx.navigateBack()
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