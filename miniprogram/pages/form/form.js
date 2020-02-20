import areaList from './area.js'
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList,
    multiArray: [['请选择','计算机科学与技术类', '电气信息类', '经济学类'],['请选择']],
    multiIndex: [0, 0, 0],
    objectMultiArray:[[{
      text:'全部',
      id:0
    }],[
      {
        text:'16计科一',
        id:1
      },
      {
        text:'17计科一',
        id:2
      },
      {
        text:'18计科一',
        id:3
      },
      {
        text:'19计科一',
        id:4
      },
    ],[
      {
        text:'16电器一',
        id:5
      },
      {
        text:'17电器一',
        id:6
      },
      {
        text:'18电器一',
        id:7
      },
      {
        text:'19电器一',
        id:8
      }
    ],[
      {
        text:'16经济一',
        id:9
      },
      {
        text:'17经济一',
        id:10
      },
      {
        text:'18经济一',
        id:11
      },
      {
        text:'19计科一',
        id:12
      }
    ]],
    classId:'',
    show: false,
    showArea: false,
    oldCitys:[],
    citys:[],
    radio: '1',
    isPut:false,
    phone:'',
    name:'',
    studentId:''
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
    if (!this.data.classId) {
      Toast('请选择班级')
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
        isHot: this.data.radio,
        studentId: this.data.studentId,
        classId: this.data.classId
      }
    })
    wx.navigateBack()
  },
  bindMultiPickerColumnChange(e){
    if(e.detail.column === 0){
      let list = this.data.objectMultiArray[e.detail.value]
      let nameList = []
      list.forEach((item) => {
        nameList.push(item.text)
      })
      this.setData({
        'multiArray[1]': nameList,
        'multiIndex[0]':e.detail.value
      })
    }else{
      this.setData({
        'multiIndex[1]': e.detail.value
      })
    }
  },
  bindMultiPickerChange(e){
    this.setData({
      classId: this.data.objectMultiArray[e.detail.value[0]]
              [e.detail.value[1]]
              .id
    })
    console.log(this.data.classId)
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
  changeId(e){
    this.setData({
      studentId: e.detail.value
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
      isPut: app.globalData.user.isPut || '',
      isCommited: app.globalData.user.isCommited || '',
      name: app.globalData.user.name || '',
      phone: app.globalData.user.phone || '',
      studentId: app.globalData.user.studentId||''
    })
  }
})