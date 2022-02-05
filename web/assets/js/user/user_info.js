$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间！'
      }
    }
  })
  //initialise user's infomation
  initUserInfo();

  //reset
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    initUserInfo();
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // call the getUserInfo in fathe page to render user's avatar anew
        window.parent.getUserInfo();
      }
    })
  })
})

//函数作用域是定义时的作用域而不是运行时的作用域
function initUserInfo() {
  $.ajax({
    url: "/my/userinfo",
    method: "GET",
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      layui.form.val('formUserInfo', res.data)
    }
  })
}