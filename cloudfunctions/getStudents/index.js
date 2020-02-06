// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database().collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  let data = await db.get()
  data = data.data
  let passHuBeiList = data.filter((item)=>{
    return item.passCity.filter((city)=>{
      return city.indexOf('湖北')>-1
    }).length>0
  })
  let hotList = data.filter((item)=>{
    return item.isHot === 2
  })
  return {
    passHuBeiList,
    hotList
  }
}