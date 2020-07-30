$(function () {
    //切换 登录和注册 表单
    $('#link_reg').on('click', function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
    //layui 表单验证规则
    var form = layui.form;
    form.verify({

        pwd: [/^\S{6,12}$/, "密码为6-12位，不能包含空格"],
        repwd: function (value) {

            if ($('#reg-pwd').val() !== value) {
                return "两次密码不一致"
            }
        }
    })
    //    注册功能
    var layer = layui.layer;
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('#link_login').click()
                $('#form-reg')[0].reset();
            }
        })
    })

    // 登录功能
    $('#form-login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                localStorage.setItem("token", res.token);
                location.href = "/index.html"
            }
        })
    })

})