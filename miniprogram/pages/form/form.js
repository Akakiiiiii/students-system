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
    radio: '1'
  },
  async handleForm(){
    let citys = []
    this.data.citys.forEach((item)=>{
      citys.push(item.split('-')[0].slice(0,2))
    })
    citys = [...new Set(citys)]
    Toast('提交成功')
    await wx.cloud.callFunction({
      name: 'updataArea',
      data: {
        citys: citys
      }
    })
    await wx.cloud.callFunction({
      name: 'updataUser',
      data: {
        citys: this.data.citys,
        _id: app.globalData.user._id,
        isHot: this.data.radio
      }
    })
    app.globalData.user.passCity = [...this.data.oldCitys,...this.data.citys]
    wx.navigateBack()
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
    this.setData({ show: false, showArea: false });
  },
  showPopup() {
    this.setData({ show: true });
  },
  handleShowArea() {
    this.setData({ showArea: true });
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
      oldCitys: app.globalData.user.passCity,
      radio: app.globalData.user.isHot +''
    })
  }
})