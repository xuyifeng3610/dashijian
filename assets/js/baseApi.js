//测试路径
var testURL='http://ajax.frontend.itheima.net'
//生产路径

// 拦截或者过滤 每次AJAX请求，配置每次请求参数
$.ajaxPrefilter(function(option){
     option.url=testURL+option.url
})