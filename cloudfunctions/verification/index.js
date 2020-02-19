const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID || event.OPENID
  let user = await db.collection('user').where({
      openId: OPENID
  }).get()
  user = user.data[0]
  if(!user.admin){
    return 'error'
  }
  return 'ok'
}