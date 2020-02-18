// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
const _ = db.command
exports.main = async (event, context) => {
<<<<<<< HEAD
  const {
    OPENID
  } = cloud.getWXContext()
  const {name,phone,citys,isHot} = event
  await db.collection('user').where({
    openId: OPENID
  }).update({
      data: {
        name,
        phone,
        passCity: citys,
        isHot: isHot - 0,
        isCommited:1,
        isPut:true
=======
  await db.collection('user').where({
    openId: event.userInfo.openId
  }).update({
      data: {
        passCity: event.citys,
        isHot: event.isHot - 0,
        isCommited:1,
        isPut:true
      },
      success(res){
        _res(res)
>>>>>>> 2dc1a544281f960ee8dd28246abfac31c672ab17
      }
    })
  return 'ok'
}