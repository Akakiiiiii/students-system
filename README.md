**前言**
***
初学小程序，每天起床第一件事不是去看文档，而是打开班群接龙打卡信息，填写ex表（苦逼的大二狗每天群通知99+），所以萌生了写一款让学生报备信息的小程序。本来只是简单写了一个上报表单的程序，但是写完了之后又觉得好像缺了点什么，所以功能越写越多，项目不断重构，里面很多东西都是现学现用，陆陆续续写了10天左右，算是一滴都不剩了。。不对，是差不多写得没想法了，项目包含了一整套前后端的交互，由于很多数据前期和后期设计理念不一样，所以会有很多不完善的地方，希望大家轻喷。废话不多说，现在主要讲一下该项目的设计思路和一些功能的实现思路。  
**技术栈**  

* 微信小程序
* 云开发
* vant
* colorui
* echarts微信小程序版本

**功能设计**  
***
**首页**


![](https://user-gold-cdn.xitu.io/2020/2/21/170673735898130b?w=400&h=860&f=gif&s=1783104)

首页长这样，由一个谣言的轮播（数据来源丁香园）和一个本校学生寒假分布地图等等组成，学生上报数据之后地图相应的省份的人数便会更新。  
地图的数据存在云数据库中，单独由一份表来维护，每个省份都是一个记录。
![](https://user-gold-cdn.xitu.io/2020/2/21/17066dd64ae81be4?w=1208&h=814&f=jpeg&s=34896)


```
{
  "_id": "上海",  
  "name": "上海", //省名
  "value": 87.0  //该省份存在本校学生的人数
}
```
地图的数据从云函数getArea获取后返回到前台页面，进行地图的初始化，具体的例子可以参考[微信小程序版echarts的map](https://github.com/ecomfe/echarts-for-weixin/tree/master/pages/map)，也可以直接看我的源码，这里说一下里面的一些坑，由于绘画地图要引入中国地图的json数据（目录下的mapData），而小程序版本的echarts的例子中只有河南地图的json数据，因此需要去[https://github.com/apache/incubator-echarts/tree/master/map/json]()这里来复制中国地图的json代码，粘贴至目录下的mapData中的json段落，才可以绘制中国的地图（其余地图也同理）。当初简直被坑得不要不要的。因为地图数据是异步获取的，所以地图的初始化在获取数据后进行。

```

    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    wx.cloud.callFunction({
      name: 'getArea'
    }).then((res)=>{
      let result = res.result
      let option = initOption(result)
      this.ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(option)
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;
        return chart;
      });
    })
```
卡片式的轮播来自于[colorui](https://github.com/weilanwl/ColorUI)，这是一个微信小程序的css库，将对应的class名称添加进去即可。
***

**数据上报页面**



![](https://user-gold-cdn.xitu.io/2020/2/21/170673780e13030b?w=400&h=872&f=gif&s=945904)

学生填写自己的姓名学号手机，选择自己所在的学院班级（由于精力有限只做了几个学院），添加自己所在的城市，选择是否发热后就可上报数据。   
用户数据存在云数据库中，单独由一份表维护，每个用户是一个记录

```
//一份用户数据例子
{
  "passCity": [
    "北京市-北京市-东城区"                  //目前所在地
  ],
  "openId": "oLuLy5MxC_dnd0eZhDVESsoMRln0", //用户唯一标识
  "isHot": 1.0,                             //1无发热 2有发热
  "admin": true,                            //是否为管理员
  "classId": 1.0,                           //班级所在id
  "isCommited": 1.0,                        //是否提交过了
  "name": "马化腾",                         //名字
  "phone": "18074815679",                   //号码
  "studentId": "1233545"                    //学号
}
```
第一次上报前会申请获取用户的信信息以存入数据库，用户微信的openId作为用户的唯一标识，如果用户已经存在数据库了就返回相应的用户数据，如果不存在则初始化用户数据存入数据库中。

```
// login
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
```
用户填写完信息后会触发两个云函数的调用，一个是更新用户的数据，将用户加入相应的班级，另一个是更新地图数据，将用户的所在的省份的学生人数加一。

```
//updateArea
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
    //因为广西省还有内蒙古之类的自治区的名字是不好控制的，所以使用模糊匹配
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
  //因为广西省还有内蒙古之类的自治区的名字是不好控制的，所以使用模糊匹配
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
```

```
///updataUser
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const { name, phone, citys, isHot, studentId, classId} = event
  //第一次提交时会提交所属的班级，将该学生的信息存到相应班级的表中
  if (classId){
    await db.collection('class').where({
      classId
    }).update({
      data:{
        commitedStudents:_.push({
          name,
          phone,
          citys,
          isHot: isHot - 0
        })
      }
    })
  }
  await db.collection('user').where({
    openId: OPENID
  }).update({
      data: {
        name,
        studentId,
        phone,
        classId,
        passCity: citys,
        isHot: isHot - 0,
        isCommited:1,
        isPut:true}
  })
  return 'ok'
}
```
***
**管理员页面**


![](https://user-gold-cdn.xitu.io/2020/2/21/1706737c692069a4?w=400&h=860&f=gif&s=2353867)
管理员页面可以查看全校哪位学生在湖北，哪位学生有发热迹象，也可以查看某个班级的提交情况，班级学生列表。进入此页面需要权限验证，即用户的openId对应的记录下有admin：true字段，需要开发者手动在数据库中用户添加此字段即可授予管理员权限。

```

```

![](https://user-gold-cdn.xitu.io/2020/2/21/170673d765adf4bc?w=973&h=773&f=jpeg&s=58646)

```
//验证权限云函数
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
```

班级数据存在云数据库中，单独由一份表维护，每个班级是一个记录

```

{
  "classId": 9,                   //班级id
  "name": "16经济一",             //班级名字
  "student_sum": 50,              //班级总人数
  "commitedStudents": []          //已经提交信息了的学生，每个学生是个对象
}

```


## 如何启动本项目

* git clone git@github.com:Akakiiiiii/students-system.git
* cd students-system
* cd cloudfunctions
* npm i 
* 使用微信开发工具导入该小程序，填写**自己**的**appId**
* 打开项目后进入云开发->数据库,创造三个表，分别是area，user，class，并分别导入项目json文件夹下的json文件，area表单导入名字带area的json文件，以此类推。（init代表仅仅初始化表单，没有数据。没有init的就是有数据的，假设你想看效果就导入名字不带init的）
* 最后在微信开发者工具上传所有云函数即可，选择云端安装依赖，即可跑起该项目。
 
## 完整项目请查看
**github地址**：https://github.com/Akakiiiiii/students-system  
**如果对您有帮助，希望可以得到一枚您的Star~。(〃'▽'〃)  
有任何可以改进的地方希望您可以花费一些时间开启一个Issue或者直接PR~。φ(>ω<*)**