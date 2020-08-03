$(function () {
     var layer = layui.layer
     var form = layui.form
     initArtCateList()
     function initArtCateList() {
          $.ajax({
               type: 'get',
               url: '/my/article/cates',
               success: function (res) {
                    var htmlstr = template('tpl-table', res)
                    $('tbody').html(htmlstr)
               }
          })
     }
     var indexAdd = null;
     var indexEdit = null;

     //点击新增弹出新增功能
     $('#btnAddCate').on('click', function () {
          indexAdd = layer.open({
               type: 1,
               area: ['500px', '250px'],
               title: '添加文章类别',
               content: $('#dialog-add').html()
          })
     })
     // 添加新增文章功能
     $('body').on('submit', '#form-add', function (e) {
          e.preventDefault()
          $.ajax({
               type: 'post',
               url: '/my/article/addcates',
               data: $(this).serialize(),
               success: function (res) {
                    if (res.status !== 0) {
                         return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(indexAdd)
               }
          })
     })





     // 点击编辑弹出修改功能
     $('tbody').on('click', '.btnedit', function () {
          indexEdit = layer.open({
               type: 1,
               area: ['500px', '250px'],
               title: '修改文章类别',
               content: $('#dialog-edit').html()
          })
          var id = $(this).attr('data-id')
          $.ajax({
               type: 'get',
               url: '/my/article/cates/' + id,
               success: function (res) {
                    form.val('form-edit', res.data)
               }
          })
     })
     //确认成功修改文章功能
     $('body').on('submit', '#form-edit', function (e) {
          e.preventDefault()
          $.ajax({
               type: 'post',
               url: '/my/article/updatecate',
               data: $(this).serialize(),
               success: function (res) {
                    if (res.status !== 0) {
                         return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(indexEdit)
               }
          })
     })

     // 删除文章功能
     $('tbody').on('click', '.btndelete', function () {
          var id = $(this).attr('data-id')
          layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
               $.ajax({
                    type: 'get',
                    url: '/my/article/deletecate/' + id,
                    data: $(this).serialize(),
                    success: function (res) {
                         if (res.status !== 0) {
                              return layer.msg(res.message)
                         }
                         layer.msg(res.message)
                         initArtCateList()
                         layer.close(index)
                    }


               });
          })
     })
})