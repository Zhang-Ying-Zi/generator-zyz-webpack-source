function Paging(paramsObj, callback) {
  this.container =
    paramsObj.container.indexOf(".") == 0
      ? paramsObj.container
      : paramsObj.container.indexOf("#") == 0
      ? paramsObj.container
      : "";
  this.prefix = this.container ? "_" + this.container.substring(1) : "";
  this.pageSize = paramsObj.pageSize || 10; //每页条数（不设置时，默认为10
  this.pageIndex = paramsObj.pageIndex || 1; //当前页码
  this.totalCount = paramsObj.totalCount || 0; //总记录数
  this.totalPage = Math.ceil(paramsObj.totalCount / paramsObj.pageSize) || 1; //总页数
  this.prevPage = paramsObj.prevPage || "<"; //上一页（不设置时，默认为：<）
  this.nextPage = paramsObj.nextPage || ">"; //下一页（不设置时，默认为：>）
  this.firstPage = paramsObj.firstPage || "<<"; //首页（不设置时，默认为：<<）
  this.lastPage = paramsObj.lastPage || ">>"; //末页（不设置时，默认为：>>）
  this.degeCount = paramsObj.degeCount || 3; //当前页前后两边可显示的页码个数（不设置时，默认为3）
  this.ellipsis = paramsObj.ellipsis; //是否显示省略号不可点击按钮（true：显示，false：不显示）
  this.ellipsisBtn =
    paramsObj.ellipsis == true || paramsObj.ellipsis == null
      ? '<li><span class="ellipsis">…</span></li>'
      : "";
  this.noInitCallback = paramsObj.noInitCallback; // 初始化时不需要调用回调
  this.mainClass = paramsObj.mainClass; // 最外层dom元素类名，有此值则替换掉.page-current

  var that = this;
  $$(this.container + " #page_size" + this.prefix).val(this.pageSize);

  // 生成分页DOM结构
  this.initPage = function(totalCount, totalPage, pageIndex) {
    this.totalCount = totalCount;
    this.totalPage = totalPage;
    this.pageIndex = pageIndex;
    var degeCount = this.degeCount;
    var pageHtml = ""; //总的DOM结构
    var tmpHtmlPrev = ""; //前面省略号按钮后面的DOM
    var tmpHtmlNext = ""; //后面省略号按钮前面的DOM
    var headHtml = ""; //首页和上一页按钮的DOM
    var endHtml = ""; //末页和下一页按钮的DOM

    var hasPreEllipsis = false, hasNextEllipsis = false;

    if (
      pageIndex > degeCount + 1 &&
      totalPage - pageIndex > degeCount
    ) {
      //前后都需要省略号按钮
      hasPreEllipsis = hasNextEllipsis = true;

      headHtml = getTwoLiHtmlStr('first_page', this.firstPage, 'prev_page', this.prevPage);
      endHtml = getTwoLiHtmlStr('next_page', this.nextPage, 'last_page', this.lastPage);

      var count = degeCount; //前后各自需要显示的页码个数
      for (var i = 0; i < count; i++) {
        if (pageIndex != 1) {
          tmpHtmlPrev += getOneLiHtmlStr(pageIndex - (count - i));
        }
        tmpHtmlNext += getOneLiHtmlStr(pageIndex - 0 + i + 1);
      }
    } else if (
      pageIndex > degeCount + 1 &&
      totalPage - pageIndex <= degeCount
    ) {
      //前面需要省略号按钮，后面不需要
      hasPreEllipsis = true;
      hasNextEllipsis = false; 

      headHtml = getTwoLiHtmlStr('first_page', this.firstPage, 'prev_page', this.prevPage);
      //pageIndex == totalPage 当前页就是最后一页
      endHtml = getTwoLiHtmlStr('next_page', this.nextPage, 'last_page', this.lastPage, pageIndex == totalPage ? 'span' : ''); 

      var count = degeCount; //前需要显示的页码个数
      var countNext = totalPage - pageIndex; //后需要显示的页码个数
      if (pageIndex != 1) {
        for (var i = 0; i < count; i++) {
          tmpHtmlPrev += getOneLiHtmlStr(pageIndex - (count - i));
        }
      }
      for (var i = 0; i < countNext; i++) {
        tmpHtmlNext += getOneLiHtmlStr(pageIndex - 0 + i + 1);
      }
    } else if (
      pageIndex <= degeCount + 1 &&
      totalPage - pageIndex > degeCount
    ) {
      //前面不需要，后面需要省略号按钮
      hasPreEllipsis = false;
      hasNextEllipsis = true;

      // pageIndex == 1 如果当前页就是第一页
      headHtml = getTwoLiHtmlStr('first_page', this.firstPage, 'prev_page', this.prevPage, pageIndex == 1 ? 'span' : '');
      endHtml = getTwoLiHtmlStr('next_page', this.nextPage, 'last_page', this.lastPage);

      var countPrev = pageIndex - 1; //前需要显示的页码个数
      var count = degeCount; //后需要显示的页码个数
      if (pageIndex != 1) {
        for (var i = 0; i < countPrev; i++) {
          tmpHtmlPrev += getOneLiHtmlStr(pageIndex - (countPrev - i));
        }
      }
      for (var i = 0; i < count; i++) {
        tmpHtmlNext += getOneLiHtmlStr(pageIndex - 0 + i + 1);
      }
    } else if (
      pageIndex <= degeCount + 1 &&
      totalPage - pageIndex <= degeCount
    ) {
      //前后都不需要省略号按钮
      hasPreEllipsis = hasNextEllipsis = false;

      //如果总页数就为1 || 当前页就是第一页， 则只显示页号，不可点击【即传span】
      headHtml = getTwoLiHtmlStr('first_page', this.firstPage, 'prev_page', this.prevPage, (totalPage == 1 || pageIndex == 1) ? 'span' : '');
      //如果总页数就为1 || 当前页是最后一页， 则只显示页号，不可点击【即传span】
      endHtml = getTwoLiHtmlStr('next_page', this.nextPage, 'last_page', this.lastPage, (totalPage == 1 || pageIndex == totalPage) ? 'span' : '');
      
      var countPrev = pageIndex - 1; //前需要显示的页码个数
      var countNext = totalPage - pageIndex; //后需要显示的页码个数
      if (pageIndex != 1) {
        for (var i = 0; i < countPrev; i++) {
          tmpHtmlPrev += getOneLiHtmlStr(pageIndex - (countPrev - i));
        }
      }
      for (var i = 0; i < countNext; i++) {
        tmpHtmlNext += getOneLiHtmlStr(pageIndex - 0 + i + 1);
      }
    }
     
    // 分页组件布局: 首页[<<] 上一页[<] ... 3 4 5 ...下一页[>] 末页[>>]
    pageHtml =
      headHtml +
      (hasPreEllipsis ? this.ellipsisBtn : '') +
      tmpHtmlPrev +
      getOneLiHtmlStr(pageIndex, 'active') +
      tmpHtmlNext +
      (hasNextEllipsis ? this.ellipsisBtn : '') +
      endHtml;

    $$((this.mainClass || ".page-current") + ' ' + this.container + " #page_ul" + this.prefix).html(pageHtml);
    $$((this.mainClass || ".page-current") + ' ' + this.container + " #total_count" + this.prefix).html(totalCount);

    $$((this.mainClass || ".page-current") + ' ' + this.container + " #page_ul" + this.prefix + " a").off("click", pageclick);
    $$((this.mainClass || ".page-current") + ' ' + this.container + " #page_ul" + this.prefix + " a").on("click", pageclick);
  };

  // 点击页码（首页、上一页、下一页、末页、数字页）
  function pageclick(e) {
    var _this = $$(this);
    var idAttr = _this.attr("id");
    var className = _this.attr("class");
    if (idAttr == "first_page") {
      //如果是点击的首页
      that.pageIndex = 1;
    } else if (idAttr == "prev_page") {
      //如果点击的是上一页
      that.pageIndex =
        that.pageIndex == 1 ? that.pageIndex : that.pageIndex - 1;
    } else if (idAttr == "next_page") {
      //如果点击的是下一页
      that.pageIndex =
        that.pageIndex == that.totalPage
          ? that.pageIndex
          : parseInt(that.pageIndex) + 1;
    } else if (idAttr == "last_page") {
      //如果点击的是末页
      that.pageIndex = that.totalPage;
    } else if (className == "page-number") {
      //如果点击的是数字页码
      that.pageIndex = _this.html();
    }
    //console.log(that.pageIndex , that.totalPage);
    that.initPage(that.totalCount, that.totalPage, that.pageIndex);
    callback && callback(that.pageIndex, that.pageSize);
  }

  /** element 不传默认为a元素 */
  function getTwoLiHtmlStr(id1, text1, id2, text2, element) {
    var ele = element || 'a';
    var str = 
      '<li><'+ ele +' id="'+ id1 +'" href="javascript:;">' + text1 + '</'+ ele +'></li>' +
      '<li><'+ ele +' id="'+ id2 +'" href="javascript:;">' + text2 + '</'+ ele +'></li>';
    return str;
  }

  /** className 不传默认为'page-number' */
  function getOneLiHtmlStr(pageNo, className) {
    var clname = className || 'page-number';
    return '<li><a href="javascript:;" class="' + clname + '">' + pageNo + '</a></li>';
  }

  that.initPage(that.totalCount, that.totalPage, 1);
  !that.noInitCallback && callback && callback(that.pageIndex, that.pageSize);

  // 改变每页条数
  $$(this.container + "#page_size").change(function() {
    var _this = $$(this);
    that.pageIndex = paramsObj.pageIndex = 1;
    that.pageSize = paramsObj.pageSize = _this.val() - 0;
    callback && callback(that.pageIndex, that.pageSize);
  });
}
