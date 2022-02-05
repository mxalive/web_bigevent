$(function () {
  let layer = layui.layer;
  // 1.1 obtain DOM element of the cutting area
  var $image = $('#image')
  // 1.2 configure options
  const options = {
    //aspect ratio 
    aspectRatio: 1,
    // appoint previewing area
    preview: '.img-preview'
  }

  //  ctrate cutting area
  $image.cropper(options)

  //bind click event for the choose button
  $('#btnChooseImage').on('click', function (e) {
    $("#file").click();
  })
  //bind change event for the file selection box
  $("#file").on('change', function (e) {
    //obtain the file selected by user
    console.log(e);
    let filelist = e.target.files;
    if (filelist.length === 0) {
      return layer.msg('请选择照片！')
    }
    //1. take the file selected by user
    let file = e.target.files[0]
    //2.transform the file to path
    let newImgURL = URL.createObjectURL(file)
    // 3.destroy the old cutting area firstly,then set image path renew and initialize cutting area in the end
    $image
      .cropper('destroy')      // destroy the old cutting area
      .attr('src', newImgURL)  // set image path renew
      .cropper(options)        // initialize cutting area
  });

  //bind click event for the upload button
  $('#btnUpload').on('click', function (e) {
    let dataURL = $image
      .cropper('getCroppedCanvas', { // create a canvas
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // transform the content in canvas to string in base64 formate 

    //call the api to upload avatar to server
    $.ajax({
      url: '/my/update/avatar',
      method: 'POST',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败！')
        }
        layer.msg('更换头像成功！');
        window.parent.getUserInfo();
      }
    })
  })

})