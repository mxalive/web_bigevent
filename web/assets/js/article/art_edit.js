
$(function () {
  const baseUrl = 'http://www.liulongbin.top:3007';
  let layer = layui.layer;
  let form = layui.form;
  let $image = $('#image');
  let art_state = '已发布';
  //article id
  let article_id = localStorage.getItem('id');

  //initalize rich text editor
  initEditor();

  // cropper
  // 1.1 get DOM element in cutting area
  // 1.2 configure options
  const options = {
    aspectRatio: 400 / 280,
    // appoint preview area
    preview: '.img-preview'
  }
  // 1.3 create a cutting area
  $image.cropper(options)

  initCate();
  initArticle(article_id);

  // upload file
  $('#btn-upload').on('click', function () {
    $('#coverfile').click();
  })
  $('#coverfile').on('change', function (e) {
    let file = e.target.files[0];
    let newImgURL = null;
    if (file.length === 0) {
      return layer.msg('请选择文件！')
    }

    //form url
    newImgURL = URL.createObjectURL(file);
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  });

  //bind click event for button used to save draft
  $('#btn-save2').on('click', function () {
    art_state = '草稿';
  })
  //bind click event for button used to save draft
  $('#btn-save3').on('click', function () {
    location.href = '/web/article/art_list.html'
  })

  // bind click event for 'form-pub' form
  $('#form-pub').on('submit', function (e) {
    let fd = null;
    e.preventDefault();
    //use $(selector)[0] to transform jquery object to primary object
    fd = new FormData($(this)[0]);
    //keep the value of article's publish state in fd
    fd.append('state', art_state);
    fd.append('Id', article_id);

    //get blob form data
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 200
      })
      .toBlob(function (blob) {
        //keep file object in fd
        fd.append('cover_img', blob);
        publishArticle(fd)
      })

  })
  // obtain article categories
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        let htmlStr = template('tpl-table', res);
        $('[name=cate_id').html(htmlStr);
        //get data by ajax and need to render layui form again
        form.render();
      }
    })
  }
  //obtain article information
  function initArticle(article_id) {
    $.ajax({
      url: '/my/article/' + article_id,
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        console.log(res);
        form.val('article', res.data);//fill form by ajax data

        //Set value to textarea TinyMCE after ajax data
        tinymce.activeEditor.setContent(res.data.content);
        // form.render();//render form again 
        $image
          .cropper('destroy')      // 销毁旧的裁剪区域
          .attr('src', baseUrl + res.data.cover_img)  // 重新设置图片路径
          .cropper(options)        // 重新初始化裁剪区域
      }
    })
  }
  //send ajax request
  function publishArticle(fd) {
    $.ajax({
      url: '/my/article/edit',
      method: "POST",
      data: fd,
      //attention!!
      //if we send server FormData data,
      //we must add two configure options as follow
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        setTimeout(function () {
          location.href = '/web/article/art_list.html'
        }, 1000)

      }
    })
  }

})