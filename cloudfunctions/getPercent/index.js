// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = []
  let count = 0
  let hubei
  let anquan = 0

  await db.collection('area').get().then((res) => {
    data = res
  })
  data.data.forEach((item)=>{
    if(item.name == "湖北") hubei =item.value
    count = count +item.value
  })


  await db.collection('user').get().then((res) => {
    data = res
  })
  console.log(data)
  data.data.forEach((item) => {
    if (item.isHot == 1) anquan++
  })
  anquan = Math.floor(((anquan + 13) / data.data.length) * 100)
  hubei = Math.floor(((hubei + 500) / count) * 100)
  return {
    anquan,hubei
  }
}