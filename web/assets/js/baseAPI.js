// ajaxPrefilter will be called befoe calling $.get(),
// $.post() and $.ajax() everytime
$.ajaxPrefilter(function (options) {
  //before launching ajax request,joint the root path unnifiedly
  options.url = "http://www.liulongbin.top:3007" + options.url
})