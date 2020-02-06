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
  for(let i =0;i<event.citys.length;i++){
    await db.collection('area').where({
      name: db.RegExp({
        regexp: event.citys[i],
        options: 's',
      })
    }).update({
      data: {
        value: _.inc(1)
      }
    })
  }
  return 'ok'
}