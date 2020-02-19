// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
const _ = db.command
exports.main = async(event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  // 如果已经提交过了的学生再提交的话，就把上一次保存地区的人数减1
  if (event.isCommited) {
    let oldCity = await db.collection('user').where({
      openId: event.userInfo.openId
    }).get()
    oldCity = oldCity.data[0].passCity[0].substr(0, 2)
    await db.collection('area').where({
      name: db.RegExp({
        regexp: oldCity,
        options: 's',
      })
    }).update({
      data: {
        value: _.inc(-1)
      }
    })
  }
  //因为广西省还有内蒙古之类的自治区是不好控制的，所以使用模糊匹配
  await db.collection('area').where({
    name: db.RegExp({
      regexp: event.citys[0],
      options: 's',
    })
  }).update({
    data: {
      value: _.inc(1)
    }
  })
  return 'ok'
}