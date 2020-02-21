// pages/admin/admin.js
Page({
  skipClass(){
    wx.navigateTo({
      url: '../class/class',
    })
  },
  skipDetail(){
    wx.navigateTo({
      url: '../detail/detail',
    })
  }
})