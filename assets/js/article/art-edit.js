$(function () {
    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    var Id = location.search.split('=')[1]
    $.ajax({
        type: 'get',
        url: '/my/article/' + Id,
        success: function (res) {
            // console.log(res);

            $('[name=Id]').val(res.data.Id)

            $('[name=title]').val(res.data.title)

            $('#image').attr('src', testURL + res.data.cover_img)

            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content);
            }, 1000)

            initCate(res.data.cate_id)

        }
    })
    // 定义加载文章分类的方法
    function initCate(cate_id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                res.cate_id = cate_id
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }


    //点击封面 触发文件选择功能
    $('#btnchooseimage').on('click', function () {
        $('#coverFile').click()
    })
    //选择文件上传到裁剪区域
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var state = ''
    $('#btnSave1').on('click', function () {
        state = '已发布'
    })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()

        //  基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData(this)
        console.log(fd);
        //  将文章的发布状态，存到 fd 
        fd.append('state', state)
     
        //生产二进制图片
        //  将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //  将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 发起 ajax 数据请求
                editArticle(fd)
            })

    })
    function editArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                location.href = '/article/art-list.html'
                window.parent.document.querySelector('#dd-gaoliang1').className = "layui-this";
                window.parent.document.querySelector('#dd-gaoliang2').className = ""

            }
        })
    }

})