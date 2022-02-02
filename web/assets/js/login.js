$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();


  })
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();

  })

  // get form object from layui
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    // User-defined PWD verification rules
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {

      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // lisening the submit event of reg form
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();

    //launch the psot request of Ajax
    var data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录');
      //Simulate human click behavior
      $('#link_login').click();

    })
  })

  //listening submit event of reg form
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res !== 0) {
          return layer.msg("登陆失败！");
        }
        layer.msg("登陆成功！");
        localStorage.setItem('token', res.token)
        //Jump to the background home page
        location.href = '/index.html';
      }
    })
  })
})