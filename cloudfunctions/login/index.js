// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database().collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  let result = await db.where({
    openId: OPENID
  }).get()
  //如果在数据库没找到该用户，则初始化数据后存入数据库
  if(!result.data.length){
    Object.assign(event.user, event.userInfo)
    event.user.isPut = false
    event.user.isHot = 0
    event.user.passCity = []
    await db.add({
      data:event.user
    })
  }
  return result
}