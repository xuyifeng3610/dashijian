$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //   layer.msg('获取文章列表成功！')
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
                renderPage(res.total)
            }
        })
    }
    initCate()
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }



    $('#form-search').on('submit', function (e) {

        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.state = state
        q.cate_id = cate_id
        initTable()
    })

    //分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',//分页容器的 
            count: total,//总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                //   console.log(first)
                //   console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }


        })

    }

    //删除功能
    $('tbody').on('click', '.btndelete', function () {
        var id = $(this).attr('data-id')
        var len = $('.btndelete').length
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if (len === 1 && q.pagenum > 1) {
                        q.pagenum = q.pagenum - 1
                    }
                    initTable()

                }


            });
            layer.close(index)
        })
    })



})