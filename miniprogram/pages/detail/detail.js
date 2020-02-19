// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passHuBeiList:[],
    hotList:[]
  },
  onLoad() {
    wx.cloud.callFunction({
      name: 'getStudents'
    }).then((res) => {
      console.log(res)
      let result = res.result
      this.setData({
        passHuBeiList: result.passHuBeiList,
        hotList: result.hotList
      })
    })
  },
  backPage() {
    wx.navigateBack()
  }
})