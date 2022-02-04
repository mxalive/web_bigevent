// ajaxPrefilter will be called befoe calling $.get(),
// $.post() and $.ajax() everytime
$.ajaxPrefilter(function (options) {
  //before launching ajax request,joint the root path unnifiedly
  options.url = "http://www.liulongbin.top:3007" + options.url

  //set request headers unifiedly for the authorised api
  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  options.complete = function (res) {
    // whatever success or fail,it will call the callback function 'complete' at end
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // token clearv up token by force
      localStorage.removeItem('token');
      // jump to login.html by force
      location.href = './login.html'
    }
  }
})