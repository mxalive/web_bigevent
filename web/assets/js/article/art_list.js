$(function () {
  //define a query parameter object to request data in future
  let layer = layui.layer;
  let form = layui.form;
  let layPage = layui.laypage;
  let q = {
    pagenum: 1,//page number,quest the number one page by default
    pagesize: 2,//how many items of data evry page show
    cate_id: '',// article category id
    state: ''//article publish state
  }
  initTable();
  initCate();

  //define a filter to formate time
  template.defaults.imports.dateFormat = function (data) {
    const dt = new Date(data);
    let y = pddZero(dt.getFullYear());
    let m = pddZero(dt.getMonth() + 1);
    let d = pddZero(dt.getDate());
    let hh = pddZero(dt.getHours());
    let mm = pddZero(dt.getMinutes());
    let ss = pddZero(dt.getSeconds());
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  // bind submit event for 'form-search' form 
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    let cate_id = $('[name=cate_id').val();
    let state = $('[name=state').val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  })

  //edit button
  $('tbody').on('click', '.btn-edit', function () {
    localStorage.setItem('id', $(this).data('id'))
    location.href = '/web/article/art_edit.html'
  })

  //delete button
  $('tbody').on('click', '.btn-delete', function () {
    //get the num of delete button
    let len = $(".btn-delete").length;
    const id = $(this).data('id');
    layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
      if (len === 1) {//len===1 means that no data in this page
        q.pagenum = q.pagenum === 1 ? 1 : --q.pagenum;

      }
      //do something
      $.ajax({
        url: '/my/article/delete/' + id,
        method: 'GET',
        success: function (res) {
          if (res.status !== 0) {

            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')

          initTable();
        }
      })
      layer.close(index);
    });


  })

  //define a method to render pages
  function renderPage(n) {
    // carry out laypage instance
    layPage.render({
      elem: 'pageBox',
      count: n,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'pre', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      //pages change will trigger the jump callback
      // and three are tow methods to trigger jumpp callback
      //one is clicking the page button           first==true
      //another is once calling the laypage.render() method ,
      //the jump callback will be triggered       first==undefined
      jump: function (obj, first) {
        //asign the newest page number value to query parameter in object q
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) { //if we click the page button ,first==undefined
          initTable();//if we call laypage.render() method,first ==true
        }
      }
    });
  }

  //define a function to fill zero
  function pddZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // obtain a list of article 
  function initTable() {
    $.ajax({
      url: '/my/article/list',
      method: 'GET',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        //render data in page by template
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        //call the method to render page
        renderPage(res.total);
      }
    })
  }
  // obtain  article categories 
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！');
        }
        //render data in page by template
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        //inform layui to render form structure renew
        form.render();
      }
    })
  }


})