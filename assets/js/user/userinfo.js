$(function () {
    var form = layui.form
    var layer = layui.layer
    // 用户昵称验证
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    inituserinfo()
    // 初始化用户的基本信息
    function inituserinfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                //  用form.val 给表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 重置数据表单
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        inituserinfo()
    })




    // 提交修改用户信息
    $('.layui-form').submit(function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/my/userinfo',
            //获取form表单里面input内容
            data: $(this).serialize(),
            success:function(res){
                if (res.status!==0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                window.parent.getuserinfo()
            }
        })
    })
})