import * as echarts from '../../ec-canvas/echarts';
import geoJson from './mapData.js';
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
echarts.registerMap('china', geoJson);
const app = getApp();
function initOption(data) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a0}:{c0}'
    },
    position: 'bottom',
    visualMap: {
      show: true,
      type: 'piecewise',
      min: 0,
      max: 2000,
      align: 'left',
      top: '66%',
      left: 0,
      left: 'auto',
      inRange: {
        color: [
          '#ffc0b1',
          '#ff8c71',
          '#ef1717',
          '#9c0505'
        ]
      },
      pieces: [
        { min: 1000 },
        { min: 500, max: 999 },
        { min: 100, max: 499 },
        { min: 10, max: 99 },
        { min: 1, max: 9 }
      ],
      orient: 'vertical',
      showLabel: true,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 10
      }
    },
    series: [{
      left: 'center',
      type: 'map',
      name: '学生到访人数',
      label: {
        show: true,
        position: 'inside',
        fontSize: 6
      },
      mapType: 'china',
      data: data.data,
      zoom: 1.2,
      roam: false,
      showLegendSymbol: false,
      emphasis: {},
      rippleEffect: {
        show: true,
        brushType: 'stroke',
        scale: 2.5,
        period: 4
      }
    }]
  }
}

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    active: 0,
    current: 0,
    passHuBeiList:[],
    hotList:[],
    rumors:[],
    cardCur: 0
  },
  changeCurrent(e) {
    this.setData({
      current: e.detail.index
    })
  },
  changeIndex(e) {
    this.setData({
      active: e.detail.current
    })
  },
  skipLogin(){
    wx.navigateTo({
      url:'../login/login'
    })
  },
  skipForm(){
    if(!this.data.isLogin){
      Toast('请先登录')
      wx.navigateTo({
        url: '../login/login'
      })
    }else {
      wx.navigateTo({
        url: '../form/form'
      })
    }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  loginOut(){
    const self = this
    wx.removeStorage({
      key: '_id',
      success(res) {
        self.setData({
          isLogin:false
        })
      }
    })
  },
  showDetail(e){
    Dialog.alert({
      title: '联系信息',
      message: '电话号码：' + this.data.passHuBeiList[e.currentTarget.dataset.index - 0].phone +'\n' + '家庭住址：xxx-xxx-xxx'
    })
  },
  showDetail2(e) {
    Dialog.alert({
      title: '联系信息',
      message: '电话号码：' + this.data.hotList[e.currentTarget.dataset.index - 0].phone + '\n' + '家庭住址：xxx-xxx-xxx'
    })
  },
  onLoad(){
    const self = this
    wx.request({
      url: 'https://lab.isaaclin.cn/nCoV/api/rumors',
      success(res){
        self.setData({
          rumors:res.data.results
        })
      }
    })
    wx.cloud.callFunction({
      name:'getStudents'
    }).then((res)=>{
      let result = res.result
      this.setData({
        passHuBeiList: result.passHuBeiList,
        hotList:result.hotList
      })
    })
    let id = wx.getStorageSync('_id')
    if (id) {
      wx.cloud.callFunction({
        name: 'entry',
        data: {
          _id: id
        }
      }).then((res) => {
        app.globalData.user = res.result.data[0]
        app.globalData.isLogin = true
        this.setData({
          isLogin:true
        })
      })
    }
  },
  onShow(){
    if (app.globalData.isLogin){
      this.setData({
        isLogin: app.globalData.isLogin
      })
    }
  },
  onReady() {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    wx.cloud.callFunction({
      name: 'getArea'
    }).then((res)=>{
      let result = res.result
      let option = initOption(result)
      this.ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(option)
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;
        return chart;
      });
    })
  }
});
