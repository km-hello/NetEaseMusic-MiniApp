import request from "../../utils/request"
Page({

  data: {
    phone:"",
    password:""
  },

// 获取表单数据
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
        [type]:event.detail.value
    })
  },


// 登录账号函数
  async login(){
    let{phone,password} = this.data;
      
    //前端验证
    if(!phone){
        wx.showToast({
          title: '手机号码不能为空！',
          icon:"none"
        })
        return;
    }
    // 手机号码正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
        wx.showToast({
          title: '手机号格式错误！',
          icon:"none"
        })
        return;
    }
    if(!password){
        wx.showToast({
            title: '密码不能为空！',
            icon:"none"
          })
          return;
    }
// 前端验证通过后，发送请求调用接口进行后端验证
    let result = await request("/login",{phone,password, isLogin:true});
    console.log(result);
    // console.log(result);
    if(result.success){
        wx.showToast({
          title: '登录成功',
          icon:"none"
        });

        wx.setStorageSync('userInfo', result)

        wx.switchTab({
          url: '../personal/personal',
        })
  
    }else{
        wx.showToast({
          title: '登录失败，请重试！',
          icon:"none"
        })
    }
  },
})