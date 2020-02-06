// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database().collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  let data = await db.where({
    account: event.account,
    password: event.password-0
  }).get()
  if(data.data.length){
    return {
      code:200,
      data
    }
  }else{
    return {
      code:400
    }
  }
  
}