// pages/class/class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['请选择', '计算机科学与技术类', '电气信息类', '经济学类'], ['请选择']],
    multiIndex: [0, 0, 0],
    objectMultiArray: [[{
      text: '全部',
      id: 0
    }], [
      {
        text: '16计科一',
        id: 1
      },
      {
        text: '17计科一',
        id: 2
      },
      {
        text: '18计科一',
        id: 3
      },
      {
        text: '19计科一',
        id: 4
      },
    ], [
      {
        text: '16电器一',
        id: 5
      },
      {
        text: '17电器一',
        id: 6
      },
      {
        text: '18电器一',
        id: 7
      },
      {
        text: '19电器一',
        id: 8
      }
    ], [
      {
        text: '16经济一',
        id: 9
      },
      {
        text: '17经济一',
        id: 10
      },
      {
        text: '18经济一',
        id: 11
      },
      {
        text: '19计科一',
        id: 12
      }
    ]],
    green: {
      '0%': '#39b54a',
      '100%': '#8dc63f'
    },
    commitedPercent:0,
    classId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindMultiPickerColumnChange(e) {
    if (e.detail.column === 0) {
      let list = this.data.objectMultiArray[e.detail.value]
      let nameList = []
      list.forEach((item) => {
        nameList.push(item.text)
      })
      this.setData({
        'multiArray[1]': nameList,
        'multiIndex[0]': e.detail.value
      })
    } else {
      this.setData({
        'multiIndex[1]': e.detail.value
      })
    }
  },
  bindMultiPickerChange(e) {
    const classId = this.data.objectMultiArray[e.detail.value[0]]
                    [e.detail.value[1]]
                    .id
    this.setData({
      classId
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'getClass',
      data:{
        classId
      }
    }).then((res)=>{
      wx.hideLoading()
      const data = res.result
      const commitedPercent = Math.floor(data.commitedStudents.length / data.student_sum * 100) 
      this.setData({
        commitedPercent,
        studentList: data.commitedStudents
      })
    })
  },
  backPage() {
    wx.navigateBack()
  }
})