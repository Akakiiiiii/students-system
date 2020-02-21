// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database().collection('class')


// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {classId} = event
  //验证是否有权限
  let permission = await cloud.callFunction({
    name: 'verification',
    data: { OPENID }
  })
  if (permission.result != 'ok') {
    return 'error'
  }
  let classItem = await db.where({
    classId
  }).get()
  return classItem.data[0]
}