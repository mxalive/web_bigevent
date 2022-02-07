$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let indexAdd = null;
  let indexEdit = null;
  initArtCateList();
  //Bind the click event for the Add category button
  $('#btnAddCate').on('click', function (e) {
    indexAdd = layer.open({
      type: 1,
      title: '添加文章类别',
      area: ['500px', '250px'],
      content: $('#dialog-add').html(),

    })
  })

  // bind submit event for 'form-add' form by acting
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/addcates',
      method: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList();
        layer.msg('新增分类成功！')
        layer.close(indexAdd);
      }
    })
  })

  //edit button
  $('tbody').on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    indexEdit = layer.open({
      type: 1,
      title: '修改文章类别',
      area: ['500px', '250px'],
      content: $('#dialog-edit').html(),
    })

    $.ajax({
      url: '/my/article/cates/' + id,
      method: 'GET',
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })
  // bind submit event for 'form-edit' form by acting
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/updatecate',
      method: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类失败！')
        }
        initArtCateList();
        layer.msg('更新分类成功！')
        layer.close(indexEdit);
      }
    })
  })

  //delete button
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        url: '/my/article/deletecate/' + id,
        method: 'GET',
        success: function (res) {
          if (res.status !== 0) {

            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          initArtCateList();
        }
      })
      layer.close(index);
    });


  })




  // obtain a list of article categories
  function initArtCateList() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  }


})