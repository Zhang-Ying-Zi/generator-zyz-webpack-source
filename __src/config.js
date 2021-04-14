var api_base = (function () {
  if (location.hostname == "xinge.ruolin-link.com") {
    return "https://xinge.ruolin-link.com/s";
  } else {
    return "http://tstxg.ruolin-link.com:8085";
  }
})();

function BaseConfig() {}

BaseConfig.prototype.service = {
  PRIX: api_base,
  api: api_base + "/api/v2",
};

var baseConfig = new BaseConfig();
var MAIN_MENU_ACTIVE_CLASS = "menu-main-selected";
var CHILD_MENU_ACTIVE_CLASS = "menu-child-selected";
var HOME_PAGE_URL = "/";

var PAGE_SIZE = 15;

// 默认分页配置
var PAGE_DEFAULT_CONFIG = {
  container: "pages",
  totalCount: 0,
  pageSize: PAGE_SIZE, //每页条数（不设置时，默认为10）
  prevPage: "上一页", //上一页（不设置时，默认为：<）
  nextPage: "下一页", //下一页（不设置时，默认为：>）
  firstPage: "首页", //首页（不设置时，默认为：<<）
  lastPage: "末页", //末页（不设置时，默认为：>>）
  degeCount: 2, //当前页前后两边可显示的页码个数（不设置时，默认为3）
  ellipsis: true, //是否显示省略号按钮(不可点击)（true:显示，false:不显示，不设置时，默认为显示）
};

/** 星期 */
var WEEK_DAY = ["日", "一", "二", "三", "四", "五", "六"];

/** 月份 */
var MONTH_NAME = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
var MONTH_EN_NAME = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var MONTH_NUM_NAME = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];
