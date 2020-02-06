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
  let data = await db.collection('user').where({
      _id: event._id
    }).get()
  let arr = [...data.data[0].passCity,...event.citys]
  console.log(arr)
  await db.collection('user').where({
    _id: event._id
  }).update({
      data: {
        passCity: arr,
        isHot: event.isHot - 0,
        isCommited:1
      },
      success(res){
        _res(res)
      }
    })
  return 'ok'
}