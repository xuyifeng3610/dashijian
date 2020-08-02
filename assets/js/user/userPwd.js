$(function () {
    var form = layui.form
    var layer = layui.layer
    // 为密码框定义校验规则
    form.verify({
        pwd: [/^\S{6,12}$/, "密码为6-12位，不能包含空格"],
        newpwd: function (value) {

            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能一致"
            }
        },
        repwd: function (value) {

            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不一致"
            }
        }
    })


    // 提交修改后的新密码
    $('.layui-form').submit(function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/my/updatepwd',
            //获取form表单里面input内容
            data: $(this).serialize(),
            success:function(res){
                if (res.status!==0) {
                    return layer.msg(res.message)
                }
                layer.msg('密码更新成功')
                $('.layui-form')[0].reset()
            }
        })
    })
})