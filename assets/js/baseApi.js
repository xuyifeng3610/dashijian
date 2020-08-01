//测试路径
var testURL='http://ajax.frontend.itheima.net'
//生产路径

// 拦截或者过滤 每次AJAX请求，配置每次请求参数
$.ajaxPrefilter(function(option){
     option.url=testURL+option.url

     // 统一为有权限的接口，设置 headers 请求头
     if(option.url.indexOf('/my/')!==-1){
          option.headers={
               Authorization:localStorage.getItem('token')
           }
     }
     //所有请求都有进行身份认证
     option.complete=function(res){
          if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
               localStorage.removeItem('token')
                location.href='/login.html'
          }
     }
})