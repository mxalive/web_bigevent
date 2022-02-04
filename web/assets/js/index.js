$(function () {

  getUserInfo();
  let layer = layui.layer;
  $('#btnLogOut').on('click', function (e) {
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      //clear up lacalStrorage
      localStorage.removeItem('token');
      //jump to login.html anew
      location.href = './login.html'

      //close confirm
      layer.close(index);
    })
  })
})

function getUserInfo() {

  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      renderAvatar(res.data);
    }
  })
}

//render user's avatar
function renderAvatar(user) {
  //get the username
  let name = user.nickname || user.username;
  //set "欢迎"text
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  //render user's avatar by need
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide()
  } else {
    let first = name[0].toUpperCase();
    $('.layui-nav-img').hide()
    $('.text-avatar').html(first).show()
  }
}