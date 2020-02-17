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
      name: '人数',
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
    rumors: ['../../images/1.jpg', '../../images/2.jpg','../../images/3.jpg'],
    cardCur: 0,
    showDetail:false,
    hubei:0,
    anquan:0,
    green: {
      '0%': '#39b54a',
      '100%': '#8dc63f'
    },
    red:{
      '0%': '#f43f3b',
      '100%': '#ec008c'
    }
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
  skipForm(e){
    let user = e.detail.userInfo
    wx.cloud.callFunction({
      name:'login',
      data:{
        user
      }
    }).then((res)=>{
      app.globalData.user = res.result.data[0]
      wx.navigateTo({
        url: '../form/form'
      })
    })
    // if(!this.data.isLogin){
    //   Toast('请先登录')
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }else {
    // }
  },
  handleShowDetail(){
    this.setData({
      showDetail:true
    })
    wx.cloud.callFunction({
      name:'getPercent',
    }).then((res)=>{
      this.setData({
        hubei:res.result.hubei,
        anquan:res.result.anquan
      })
    })
    // setTimeout(()=>{
    //   this.setData({
    //     hubei: 100,
    //     anquan: 100
    //   })
    // },1000)
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  onLoad(){
    const self = this
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
