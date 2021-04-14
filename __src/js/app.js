// import "../lib/css/framework7.md.min.css";
// import "../lib/css/jquery-ui.min.css";
// import "../lib/css/jquery-ui-timepicker-addon.css";
// import "../css/app.css";

// import "../lib/framework7-4.4.0.min.js";
// import jquery from "../lib/jquery-1.12.4.min.js";
// import "../lib/jquery-ui.min.js";
// import "../lib/jquery.timepicker.addon.js";
// import "../lib/jquery.hoverIntent.minified.js";
// import "../lib/sockjs.min.js";
// import "../lib/vertx-eventbus.js";

// Dom7
var $$ = Dom7;

var app = new Framework7({
  root: "#app", // App root element
  id: "io.framework7.mdis", // App bundle ID
  name: "Framework7", // App name
  theme: "md",
  cache: false,
  data: function () {
    return {};
  },
  view: {
    pushState: true, // 页面切换地址改变
    pushStateSeparator: "#?",
    reloadPages: true,
    reloadDetail: true, // 页面切换重新加载
  },
  on: {
    routeChange: function (newRoute, previousRoute, router) {
      if (newRoute.url != "/") {
        localStorage.kfCurrentUrl = newRoute.url;
      }
    },
  },
  dialog: {
    title: "提示",
    buttonOk: "确定",
    buttonCancel: "取消",
  },
  popup: {
    closeByBackdropClick: false,
  },
  routes: [
    {
      path: "/",
      url: "./index.html",
    },
    {
      path: "/monitor",
      componentUrl: "./pages/monitor.html",
    },
    {
      path: "/devices/:tag/:name",
      componentUrl: "./pages/devices.html",
    },
    {
      path: "/alarming",
      componentUrl: "./pages/alarming.html",
    },
    {
      path: "/alarmed",
      componentUrl: "./pages/alarmed.html",
    },
    {
      path: "/violation",
      componentUrl: "./pages/violation.html?v=1.02",
    },
    {
      path: "/work",
      componentUrl: "./pages/work.html",
    },
    {
      path: "/logs",
      componentUrl: "./pages/logs.html",
    },
    {
      path: "/users",
      componentUrl: "./pages/users.html",
    },
    {
      path: "/account",
      componentUrl: "./pages/account.html",
    },
    {
      path: "/login",
      componentUrl: "./pages/login.html?v=1.02",
      options: {
        reloadCurrent: true,
      },
    },
    {
      path: "/pwd-reset",
      componentUrl: "./pages/pwd-reset.html?v=1.02",
      options: {
        reloadCurrent: true,
      },
    },
  ],
});

// Init/Create main view
var mainView = app.views.create(".view-main", {
  url: "/",
  on: {
    pageInit: function () {
      $$("input").prop("autocomplete", "off");
      $$("html").removeClass("with-modal-dialog");
      if (location.hash.indexOf("/alarm") !== -1) {
        $$("#app").css("min-width", "1560px");
      } else {
        $$("#app").css("min-width", "1460px");
      }
    },
  },
});
mainView.allowPageChange = true;

// 视频通话相关
$$("#mini-normal").hide();
$$("#min-call").hide();
$$("#call-request").hide();
$$(".local-vedio-pop").hide();
$$(".call-vedio-popup").hide();

var refreshInterval;
if (window.localStorage.kftoken) {
  $$(".nickname").text(window.localStorage.kfname);
  // 视频通话相关
  $$("#mini-normal").show();
  window.requsting = false;
  initSubMenu();
  initDispatchGroup();
  refreshInterval && clearInterval(refreshInterval);
  refreshInterval = setInterval(function () {
    // 每天零点自动刷新页面(没有通话请求或者未在通话中)
    if (!window.calling && !window.requsting && new Date().getHours() == 0) {
      window.location.reload();
    }
  }, 60 * 60 * 1000);
} else {
  $$(".home-navbar").hide();
  $$(".base-container").hide();
  if (location.hash.indexOf("/pwd-reset") !== -1) {
    location.hash = "#?/pwd-reset";
    setTimeout(function () {
      mainView.router.navigate("/pwd-reset", {
        animate: false,
        reloadCurrent: true,
      });
    }, 300);
  } else {
    location.hash = "#?/login";
    setTimeout(function () {
      mainView.router.navigate("/login", {
        animate: false,
        reloadCurrent: true,
      });
    }, 300);
  }
}

/** 退出登录 */
function jkzxLogout() {
  // closeSocket && closeSocket();
  // refreshInterval && clearInterval(refreshInterval);
  // window.localStream && window.localStream.close();
  // window.localStream = null;
  window.sessionStorage.clear();
  delete localStorage.kftoken;
  delete localStorage.kfname;
  delete localStorage.kfuserid;
  $$(".mobile").val("");
  $$(".code").val("");
  $$(".password").val("");
  $$(".home-navbar").hide();
  $$(".popup").hide();
  $$(".backdrop-in").remove();
  $$("#mini-normal").hide(); // 隐藏左侧本地视频图标
  $$("#mini-call").hide();
  $$("#call-request").hide();
  $$("html").removeClass("with-modal-dialog");
  mainView.router.navigate("/login", { animate: false, reloadCurrent: true });
}

/** 获取当前客服在线状态*/
// function getOnlineState() {
//   // apiService('/webrtc/getServiceStatus', {}, function (res) {
//   //   $$('#topnav1').removeClass('on').removeClass('leave').addClass(res ? 'on' : 'leave');
//   // });
//   if (Template7.global && Template7.global.uuid) {
//     apiService("/webrtc2/isonline", { uuid: Template7.global.uuid }, function (
//       isZaixian
//     ) {
//       $$("#topnav1")
//         .removeClass("on")
//         .removeClass("leave")
//         .addClass(isZaixian ? "on" : "leave");
//     });
//   } else {
//     $$("#topnav1").removeClass("on").removeClass("leave").addClass("leave");
//   }
// }

/** 获取菜单列表并初始化 */
function initSubMenu() {
  if (!window.localStorage.kftoken) {
    return;
  }
  // <!-- 菜单列表 -->
  var menuTemplate =
    '{{#each menuList}}\
    <li><a href="{{url}}" data-animate="false" data-reload-current="true" class="home-menu {{className}}">{{cname}}</a>\
      <div class="sub"><ul>\
        {{#each children}}\
          <li>\
            <a href="{{url}}" data-view=".view-main" class="home-menu-item {{className}}"\
              data-animate="false" data-reload-current="true">{{cname}}</a>\
          </li>\
        {{/each}}\
      </ul></div>\
    </li>\
  {{/each}}';
  var kfPathUrl = location.hash.replace("#?", "");
  // 固定菜单
  var menus = [
    { url: "/monitor", cname: "实时监控" }, // 默认选中状态
    { url: "/alarming", cname: "实时告警" },
    { url: "/alarmed", cname: "历史告警" },
    { url: "/violation", cname: "违停记录" },
    // {url: '/work', cname: '日常维养'},
    { url: "/logs", cname: "接听记录" },
    { url: "/users", cname: "用户管理" },
  ];
  var fmenus = menus.find(function (fm) {
    return fm.url == kfPathUrl;
  });
  if (fmenus) {
    fmenus.className = MAIN_MENU_ACTIVE_CLASS;
  } else if (kfPathUrl !== "/account") {
    kfPathUrl = "/monitor";
    location.hash = "/monitor";
    menus[0].className = MAIN_MENU_ACTIVE_CLASS;
  }
  mainView.router.navigate(kfPathUrl, { animate: false, reloadCurrent: true });

  var compiledMenuTemplate = Template7.compile(menuTemplate);
  var innerHTML = compiledMenuTemplate({ menuList: menus });
  $$("#topnav").html(innerHTML);

  // 页面元素添加后再绑定事件
  if (Template7.global && Template7.global.hoverConfig) {
    $("ul#topnav > li").hoverIntent(Template7.global.hoverConfig);
  }
}

/** 获取调度组列表 */
function initDispatchGroup() {
  // 查调度组
  $$(".jkdd").hide();

  apiService("/users/listgrp2", { type: "dispatch" }, function (data) {
    // 请求成功
    window.sessionStorage.grplist = JSON.stringify(data || []);
    if (!data.length) {
      return;
    }
    $$(".group-name").html(data[0].cname);
    window.localStorage.curgrpid = data[0].grpid;
    window.localStorage.curgrpname = data[0].cname;

    registerAlarmEvent();

    if (data.length > 1) {
      $$(".jkdd").show();
      var ddtemplate = Template7.compile(
        '{{#each groupList}}<li><a href="#" data-id="{{grpid}}" class="grp">{{cname}}</a></li>{{/each}}'
      );
      var innerHTML = ddtemplate({ groupList: data });
      $$(".group-ul").html(innerHTML);
    }
  });
}

/** 设置全局Context */
function setGlobalContext(name, value) {
  if (!Template7.global) {
    Template7.global = {};
  }
  Template7.global[name] = value;
}

// dom元素点击或者手机触摸结束事件
$$(document).on("click touchend", function (e) {
  var x = $$(e.target);
  if (!window.amp3) {
    window.amp3 = new Audio("./lib/trtc/call-vedio.mp3");
  }

  // 点击主菜单
  if (x.hasClass("home-menu")) {
    $$(".home-menu").removeClass(MAIN_MENU_ACTIVE_CLASS);
    x.addClass(MAIN_MENU_ACTIVE_CLASS);
    return;
  }
  // 点击主菜单下的子菜单
  if (x.hasClass("home-menu-item")) {
    $$(".home-menu").removeClass(MAIN_MENU_ACTIVE_CLASS);
    x.parent()
      .parent()
      .parent()
      .parent()
      .find(".home-menu")
      .addClass(MAIN_MENU_ACTIVE_CLASS);
    return;
  }

  // 未点击顶部主菜单或者子菜单，未点击当前登录用户信息，未点击调度组及弹出的子菜单，隐藏所有子菜单
  if (
    !x.hasClass("home-menu") &&
    !x.hasClass("home-menu-item") &&
    x.parents("#topnav1").length === 0 &&
    x.parents(".jkdd").length === 0
  ) {
    $$("div.sub").hide();
  }

  // 切换调度组
  if (x.hasClass("grp")) {
    var gid = x[0].dataset.id;
    if (gid && gid != localStorage.curgrpid) {
      // 更新选择调度组
      apiService("/users/selectgrp", { grpid: +gid }, function () {
        // 取消监听旧的组
        eb && eb.unregisterHandler("ALARMCHANGED" + localStorage.curgrpid);

        localStorage.curgrpid = +gid;
        localStorage.curgrpname = x[0].innerHTML;
        $$(".group-name").text(localStorage.curgrpname);
        // 重新监听事件
        registerAlarmEvent();
        // 进入监控页
        $$('a[href="/monitor"]').click();
      });
    }
    return;
  }

  // 切换在线状态
  if (x.hasClass("online") || x.hasClass("offline")) {
    var islive = x.hasClass("online") ? true : false; // 改变状态
    var curlive = $$("#topnav1").hasClass("on") ? true : false; // 当前状态
    if (islive != curlive) {
      // 状态不一致需要接口更新
      apiService(
        "/webrtc/" + (islive ? "serviceStart" : "servicePause"),
        {},
        function (data) {
          $$("#topnav1")
            .removeClass("on")
            .removeClass("leave")
            .addClass(islive ? "on" : "leave");
        }
      );
    }
    return;
  }

  // 退出登录
  if (x.hasClass("exit") || x.hasClass("exitout")) {
    app.dialog.confirm(
      "确定要退出吗?",
      function () {
        // apiService('/webrtc/getServiceStatus/serviceOver', {}, function (loutres) {
        jkzxLogout();
        // });
      },
      function () {}
    );
    return;
  }

  // 打开本地视频
  if (x.hasClass("camera-icon")) {
    openLocalVedioPopup();
    return;
  }

  // 降锁
  if (x.hasClass("downlock")) {
    var locksn = x[0].dataset.sn;
    if (!locksn) {
      return;
    }
    app.dialog.confirm("确定要操作降锁？", function () {
      $$(".downlock").prop("disabled", true);
      $$(".downlock").css("pointer-events", "none");
      apiService(
        "/webrtc/opLotlock",
        { locksn: +locksn, val: false },
        function (data) {
          app.dialog.alert("降锁成功");
        },
        function () {
          $$(".downlock").prop("disabled", false);
          $$(".downlock").css("pointer-events", "");
        }
      );
    });
    return;
  }

  // 重设收费金额
  if (x.hasClass("resetfee")) {
    var lottag = x[0].dataset.lottag;
    var carSelectedType =
      $$('#video_info [name="cartype"]:checked').val() || "";
    if (!carSelectedType) {
      return app.dialog.alert("请选择车辆类型！");
    }
    var carno = ($$('#video_info input[name="carno"]').val() || "").trim();
    if (+carSelectedType == 1 && (!carno || carno.length !== 18)) {
      return app.dialog.alert("请输入正确的18位驾驶证号！");
    }
    if (+carSelectedType == 2 && (!carno || carno.length !== 8)) {
      return app.dialog.alert("请输入正确的新能源车牌！");
    }
    var ctext = "确定重设该新能源车收费标准？";
    if (+carSelectedType == 1) {
      ctext = "确定重设该残疾人车收费标准？";
    }
    carno = (carno + "").toUpperCase();

    app.dialog.confirm(ctext, function () {
      $$(".resetfee").prop("disabled", true);
      var lasturl = "/setPlate";
      var param = { lottag: +lottag, plate: carno };
      if (+carSelectedType == 1) {
        lasturl = "/setDisabledCar";
        param = { lottag: +lottag, no: carno };
      }
      apiService(
        "/dispatch/" + localStorage.curgrpid + "/lotl" + lasturl,
        param,
        function (data) {
          $$(".resetfee").prop("disabled", false);
          app.dialog.alert("收费标准重设成功");
        },
        function () {
          $$(".resetfee").prop("disabled", false);
        }
      );
    });
    return;
  }

  // 拒接，或者关闭当前视频请求
  if (x.hasClass("refuse") || x.hasClass("refuse-close")) {
    app.dialog.confirm(
      "确定要拒绝或者关闭当前视频请求吗?",
      function () {
        setGlobalContext("answered", true); // 更新应答标识
        handupCallByReason(true); // 直接挂断
      },
      function () {}
    );
    return;
  }

  // 通话弹框最小化和还原切换
  if (
    x.hasClass("mini-btn") ||
    x.hasClass("mini-call") ||
    x.hasClass("call-icon")
  ) {
    if (app.callVedio.opened) {
      $$("#mini-call").show();
      app.callVedio && app.callVedio.close();
      $$(".call-vedio-pop").hide();
    } else {
      $$("#mini-call").hide();
      app.callVedio && app.callVedio.open();
      $$(".call-vedio-pop").show();
    }
    return;
  }

  if (x.hasClass("dialog-title")) {
    app.dialog.close();
    $$(".dialog.modal-in").remove();
    $$(".dialog-backdrop.backdrop-in").removeClass("backdrop-in");
    return;
  }

  // 接通视频
  if (x.hasClass("answer") || x.parents(".answer").length > 0) {
    if (window.calling) {
      // 已有一个在通话中，防止多次点击
      return;
    }
    window.calling = true;
    setGlobalContext("answered", true); // 更新应答标识
    // var userId = window.localStorage.kftoken + '_' + new Date().getTime();
    // apiService('s/AsyncPubService/getTRTCSDKPrivateMapKey', [
    //   1400191854,
    //   userId,
    //   Template7.global.receiveCall.sn//Template7.global.roomInfo.roomid
    // ], function(cdata) {
    // 关闭声音
    window.amp3 && window.amp3.pause();
    // 打开通话框
    openVedioCallPopup();
    // 加入房间
    joinVedioRoom(0, localStorage.kfuserid, {});
    // 发送消息给后台
    // sendCallMsgHandler();
    // 记录接听时间
    window.curtime = new Date().getTime();
    // 应答
    apiService(
      "/webrtc2/answer",
      { sn: Template7.global.receiveCall.sn || 0, uuid: Template7.global.uuid },
      function () {}
    );
    // }, function() {
    //   window.calling = false;
    // });
  }

  // 挂断或者结束当前对话
  if (
    x.hasClass("guaduan") ||
    x.parents(".guaduan").length > 0 ||
    x.hasClass("guaduan-close") ||
    x.parents(".guaduan-close").length > 0
  ) {
    setGlobalContext("answered", true);
    if (window.calling) {
      // 通话中，正常挂断
      app.dialog.confirm(
        "正在通话中，确定要关闭？",
        function () {
          endVedioCall();
        },
        function () {}
      );
    } else {
      // 手动关闭当前信息保存框
      app.dialog.confirm(
        "确定要关闭当前窗口？",
        function () {
          app.callVedio && app.callVedio.close();
          $$("#mini-normal").show();
          $$(".call-vedio-pop").hide();
          window.requsting = false;
        },
        function () {}
      );
    }
  }

  // 保存通话处理问题
  if (x.hasClass("saveinfo")) {
    saveCallInfo();
  }

  // 切换通话视频视角
  if (
    x.hasClass("video-placeholder") ||
    x.parents(".video-placeholder").length > 0
  ) {
    $$("#video_live").toggleClass("me-vedio");
  }

  // 客户端挂断通话
  if (x.hasClass("user-guaduan")) {
    endVedioCall();
  }

  // 问题类型按钮选择
  if (x.hasClass("ques")) {
    $$(".ques").removeClass("selected");
    x.toggleClass("selected");
  }

  // 点击表格行更改背景色
  if (x.hasClass("label-cell") && x.parents(".table-trs").length > 0) {
    if (x.parent().hasClass("active")) {
      x.parent().removeClass("active");
    } else {
      $$(".table-trs tr").removeClass("active");
      x.parent().addClass("active");
    }
  }
});

/** 更多文本信息显示气泡框 */
$$(document).on("mouseover", function (e) {
  var x = $$(e.target);
  if (x.hasClass("outtext")) {
    app.mypopover && app.mypopover.destroy();
    app.mypopover = app.popover.create({
      targetEl: x,
      targetX: -20,
      content: `
      <div class="popover popover-info">
        <div class="popover-inner text-color-white" style="background: #000;box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);opacity: 0.9;border-radius: 4px;">
          <div class="padding-left padding-right">
            <p style="word-break: break-all;">${x.data("text")}</p>
          </div>
        </div>
      </div>`,
    });
    setTimeout(function () {
      app.mypopover.open();
    }, 1000);
  }
});

apiService(
  "/sysobject/getroot",
  {},
  function (data) {
    console.log(data);
  },
  function (errMsg) {
    console.log(errMsg);
  }
);

apiService(
  "/sysobject/listChildren",
  { tag: window.localStorage.kfarea },
  function (data) {
    console.log(data);
  },
  function (errMsg) {
    console.log(errMsg);
  }
);

apiService(
  "/sysobject/getall",
  { tag: window.localStorage.kfarea },
  function (data) {
    console.log(data);
  },
  function (errMsg) {
    console.log(errMsg);
  }
);

/** 网页视图是否可见改变事件  */
// document.addEventListener("visibilitychange", function () {
//   if (!document.hidden) {
//     if (!window.localStorage.kftoken) {
//       if (
//         location.hash.indexOf("/login") == -1 &&
//         location.hash.indexOf("/pwd-reset") == -1
//       ) {
//         // 不是登录页退出重新登录
//         jkzxLogout();
//       }
//       return;
//     }
//     getOnlineState();
//   }
// });

// 视频通话
// window.rtc = [];

/** 加入视频通话房间 */
// function joinVedioRoom(index, userId, cdata) {
//   console.log("JOIN");

//   window.rtc[index] = new RtcClient({
//     userId,
//     roomId: Template7.global.receiveCall.sn, //Template7.global.roomInfo.roomid,
//     sdkAppId: 1400191854,
//     userSig: Template7.global.receiveCall.userSig, // cdata.userSig,
//     privateMapKey: Template7.global.receiveCall.privateMapKey, //cdata.privateMapKey
//   });
//   window.rtc[index].join();
// }

/** 离开房间 */
// function leaveVedioRoom(index) {
//   window.calling = false;

//   if (!window.rtc[index]) {
//     return;
//   }
//   window.rtc[index].leave();
//   window.rtc[index] = null;
// }

/** 结束通话，显示可编辑信息，无操作1分钟后自动关闭弹框，恢复正常状态 */
// function endVedioCall() {
//   window.amp3 && window.amp3.pause();
//   handupCallByReason(false, function () {
//     window.callInterval && clearInterval(window.callInterval); // 清除通话时间计时
//     window.requsting = false;
//     leaveVedioRoom(0);
//     // 隐藏挂断按钮
//     $$(".hangup").hide();
//     $$("#edit_info").show(); // 显示可编辑内容

//     window.savetimeout && clearTimeout(window.savetimeout);
//     window.savetimeout = setTimeout(function () {
//       // 1分钟后自动关闭信息填写框
//       app.callVedio && app.callVedio.close();
//       $$("#mini-call").hide();
//       $$("#call-request").hide();
//       $$(".call-vedio-popup").hide();
//       $$("#mini-normal").show();
//     }, 60 * 1000);
//   });
// }

/** 打开视频通话中或者通话结束填写处理结果弹框 */
// function openVedioCallPopup() {
//   // 已存在通话弹框，重新更新信息
//   if (app.callVedio) {
//     // 填充数据
//     $$("#call-request").hide();
//     $$(".call-time").remove();
//     renderParkInfo(); // 再次打开需更新信息显示
//     app.callVedio.open();
//     $$(".call-vedio-pop").show();
//     $$("#edit_info").hide();
//     $$(".hangup").show();
//     return;
//   }
//   app.callVedio = app.popup
//     .create({
//       el: ".call-vedio-pop",
//       on: {
//         open: function () {
//           if (window.calling) {
//             // 第一次打开的，通话中的隐藏编辑信息框及其他弹层
//             $$("#call-request").hide();
//             $$("#mini-normal").hide();
//             $$("#mini-call").hide();
//             $$("#edit_info").hide();
//             $$(".hangup").show();
//             // 填充数据
//             $$(".call-time").remove();
//             renderParkInfo();
//           }
//         },
//         opened: function () {
//           // 高度最小为660-800，【计算弹框宽高，适应视频和信息显示宽高】
//           var curht =
//             window.innerHeight - 56 > 660
//               ? window.innerHeight - 56 > 800
//                 ? 800
//                 : window.innerHeight - 56
//               : 660;
//           var curwd = ((curht / 16) * 9).toFixed(0) - 0;
//           curwd = curwd > 400 ? curwd : 400; // 宽度最小为400
//           $$("#video_live").css({
//             width: curwd + "px",
//             height: curht + "px",
//           });
//           $$(".call-vedio-pop").css({
//             width: curwd + 450 + 20 + "px",
//             height: curht + 56 + "px",
//             marginLeft: "-" + ((curwd + 450 + 20) / 2).toFixed(0) + "px",
//             marginTop: "-" + (curht / 2 + 28).toFixed(0) + "px",
//           });
//         },
//       },
//     })
//     .open();
// }

/** 保存通话处理结果 */
// function saveCallInfo() {
//   var myinfo = {
//     remark: $$('#edit_info [name="description"]').val(),
//     curesult: $$('#edit_info [name="result"]:checked').val(),
//     troubleType: "",
//   };
//   var selectedType = $$(".ques.selected");
//   selectedType.forEach(function (curele) {
//     myinfo.troubleType = curele.dataset.type;
//   });
//   if (!myinfo.troubleType) {
//     return app.dialog.alert("请选择问题分类");
//   }
//   if (!myinfo.curesult) {
//     return app.dialog.alert("请选择当前处理结果");
//   }
//   app.dialog.confirm("确定提交保存?", "提示", function () {
//     var rparm = Object.assign({}, myinfo, {
//       sn: Template7.global.receiveCall.sn,
//     });
//     apiService("/webrtc2/saveRecord", rparm, function () {
//       app.dialog.alert("提交成功");
//       window.savetimeout && clearTimeout(window.savetimeout); // 关闭1分钟保存时间
//       closeVedioRequest(); // 保存后关闭信息填写框
//     });
//   });
// }

/** ------------------------本地视频--------------------------- */
// async function joinLocalRoom() {
//   window.localStream && window.localStream.close();
//   try {
//     // 采集摄像头和麦克风视频流
//     window.localStream = TRTC.createStream({
//       audio: true, // 采集麦克风
//       video: true, // 采集摄像头
//       userId: "xglocal_" + new Date().getTime(),
//     });
//     // 设置视频分辨率帧率和码率
//     window.localStream.setVideoProfile("720p");
//     window.localStream.setAudioProfile("high");

//     await window.localStream.initialize();
//     // ('摄像头及麦克风采集成功！');
//   } catch (error) {
//     app.dialog.alert("请确认已连接摄像头和麦克风并授予其访问权限！");
//     console.log(error);
//   }
//   window.localStream && window.localStream.play("local_my");
// }

// /** 弹出本地视频弹框 */
// function openLocalVedioPopup() {
//   app.localVedio = app.popup
//     .create({
//       el: ".local-vedio-pop",
//       on: {
//         open: function () {
//           $$("#mini-normal").hide();
//           // 高度最小为520,最大760
//           var curht =
//             window.innerHeight - 56 > 520
//               ? window.innerHeight - 56 > 760
//                 ? 760
//                 : window.innerHeight - 56
//               : 520;
//           var curwd = ((curht / 16) * 9).toFixed(0) - 0;
//           curwd = curwd > 400 ? curwd : 400; // 宽度最小为400
//           $$(".local-vedio-pop").css({
//             width: curwd + 20 + "px",
//             height: curht + 56 + "px",
//             marginLeft: "-" + (curwd / 2 + 10).toFixed(0) + "px",
//             marginTop: "-" + (curht / 2 + 28).toFixed(0) + "px",
//           });
//           // 显示本地视频
//           joinLocalRoom();
//         },
//         close: function () {
//           window.localStream && window.localStream.close();
//           window.localStream = null;
//           $$("#mini-normal").show();
//         },
//       },
//     })
//     .open();
// }

// window.onbeforeunload = function () {
//   window.localStream && window.localStream.close();
//   // 刷新或者关闭页面，关闭连接[通话中的要传sn]
//   if (window.localStorage.kftoken) {
//     closeSocket && closeSocket();
//   }
// };

/** -------------------连接socket, 注册事件监听通话请求------------------------------------- */
// var eb = null;
// var eventbusinterval = null;
// var requestTimeout;

// if (window.localStorage.kftoken) {
//   reconnectEventBus();
// } else {
//   closeSocket();
// }

// function guid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return (
//     s4() +
//     s4() +
//     "-" +
//     s4() +
//     "-" +
//     s4() +
//     "-" +
//     s4() +
//     "-" +
//     s4() +
//     s4() +
//     s4()
//   );
// }

// function reconnectEventBus() {
//   var urlPrex = baseConfig.service.PRIX;
//   eb = new EventBus(urlPrex + "/eventbus/", {
//     vertxbus_ping_interval: 5000,
//   });
//   eb.onopen = onEventBusOpen;
//   eb.onclose = onEventBusClose;
// }

// function onEventBusClose() {
//   if (eventbusinterval != null) clearInterval(eventbusinterval);
//   eventbusinterval = setInterval(function () {
//     if (
//       eb.state == EventBus.OPEN ||
//       eb.state == EventBus.CONNECTING ||
//       !localStorage.kftoken
//     )
//       return;
//     reconnectEventBus();
//   }, 5000);
// }

// function onEventBusOpen() {
//   if (eventbusinterval != null) clearInterval(eventbusinterval);
//   if (!Template7.global) Template7.global = {};
//   Template7.global.uuid = guid();
//   eb.registerHandler(
//     "WEBRTC" + localStorage.kfuserid,
//     {
//       token: localStorage.kftoken,
//       uuid: Template7.global.uuid,
//     },
//     callHandler
//   );
//   registerAlarmEvent();
//   // 连接成功后获取在线状态
//   setTimeout(function () {
//     getOnlineState();
//   }, 50);
// }

// function closeSocket() {
//   if (eventbusinterval != null) clearInterval(eventbusinterval);
//   // 通话中则断开通话，并发送通话挂掉消息
//   if (eb && eb.state == EventBus.OPEN) {
//     if (window.calling) {
//       eb.send(
//         "WEBRTC" + localStorage.kfuserid,
//         { sn: Template7.global.receiveCall.sn, type: "unregister" },
//         {}
//       );
//     }
//     eb.unregisterHandler(
//       "WEBRTC" + localStorage.kfuserid,
//       {
//         sn: window.calling ? Template7.global.receiveCall.sn : 0,
//       },
//       function () {
//         if (window.calling) {
//           leaveVedioRoom(0);
//           closeVedioRequest();
//         }
//       }
//     );
//     eb.unregisterHandler("ALARMCHANGED" + localStorage.curgrpid);
//   }
//   eb && eb.close();
// }

// function alarmHandler(err, msg) {
//   console.log(msg);
//   if (!window.localStorage.kftoken || mainView.router.url != "/monitor") {
//     return;
//   }
//   $$('a[href="/monitor"]').click(); // 有变化，重新进入此页面
// }

// function registerAlarmEvent() {
//   if (eb && localStorage.curgrpid) {
//     eb.registerHandler("ALARMCHANGED" + localStorage.curgrpid, alarmHandler);
//   }
// }

// function renderParkInfo() {
//   var infohtml = `
//     <div class="col-25">所在位置：</div><div class="col-75">{{cur.pk.cname}}</div>
//     <div class="col-25">设备类型：</div><div class="col-75">{{js "this.cur.pk.ctype == 'L' ? '路内地锁' : '场库地锁'"}}</div>
//     <div class="col-25">设备编号：</div><div class="col-75" style="position: relative;">
//       {{cur.pl.no}}
//       <span class="kfop-btn downlock pointer" data-sn="{{cur.pl.locksn}}">降锁</span>
//     </div>
//     <div class="col-25">设备状态：</div><div class="col-75">{{js "this.cur.pl.status == 2 ? '维修中' : '正常'"}}</div>
//     <div class="col-25">有无车辆：</div><div class="col-75">{{js "this.cur.pl.car ? '有' : '无'"}}</div>
//     <div class="col-25">订单状态：</div><div class="col-75">{{js "this.cur.pl.ordersn ? '有' : '无'"}}</div>
//     <div class="col-25">车辆类型：</div><div class="col-75 radios nowrap display-inline-flex">
//       <input class="mt-10" type="radio" name="cartype" id="carty1" value="1">
//       <label class="pointer" style="margin-right: 18px" for="carty1">残疾人车</label>
//       <input class="mt-10" type="radio" name="cartype" id="carty2" value="2">
//       <label class="pointer" for="carty2">新能源车</label>
//     </div>
//     <div class="col-25"></div><div class="col-75 radios nowrap display-inline-flex" style="margin-top: -5px;margin-bottom: 5px;">
//       <input name="carno" type="text" placeholder="新能源车牌" style="display:none;">
//       <span class="kfop-btn resetfee pointer" data-lottag="{{cur.pl.tag}}" style="width: 120px;position: relative;">重设收费标准</span>
//     </div>
//     <div class="col-25">翻转角度：</div><div class="col-75">{{js "this.cur.pl.agl ? this.cur.pl.agl.toFixed(2) - 0 : ''"}}</div>
//     <div class="col-25">当前电压：</div><div class="col-75">{{js "this.cur.pl.v ? this.cur.pl.v.toFixed(2) - 0 : ''"}}</div>
//     <div class="col-25">停稳时间：</div><div class="col-75">{{dateformat cur.pl.ptime 'yyyy-MM-dd hh:mm:ss' '1'}}</div>
//     <div class="col-25">通信时间：</div><div class="col-75">{{dateformat cur.pl.ctime 'yyyy-MM-dd hh:mm:ss' '1'}}</div>
//   `;
//   var compied = Template7.compile(infohtml);
//   var infohtml = compied({ cur: Template7.global.roomInfo });
//   $$("#info_row").html(infohtml);
//   // 清除之前的输入框内容
//   $$('input[name="cartype"]').on("click change", function () {
//     var curtype = $$('#video_info [name="cartype"]:checked').val() || "";
//     $$('input[name="carno"]').show();
//     if (+curtype == 2) {
//       $$('input[name="carno"]').attr("placeholder", "新能源车牌");
//     } else {
//       $$('input[name="carno"]').attr("placeholder", "驾驶证号");
//     }
//   });
//   $$(".ques").removeClass("selected");
//   $$('[name="description"]').val("");
// }

// /** 有新的视频通话请求 */
// function callHandler(err, msg) {
//   console.log(msg);
//   if (!window.localStorage.kftoken) {
//     return;
//   }
//   if (msg.body.act == "hangup" && msg.body.uuid == Template7.global.uuid) {
//     // 客户端取消视频通话
//     requestTimeout && clearTimeout(requestTimeout);
//     closeVedioRequest();
//     return;
//   }
//   if (msg.body.act == "offline") {
//     getOnlineState();
//     leaveVedioRoom(0); // 通话中断网，再次联网时离开上次通话房间
//     return;
//   }
//   if (msg.body.act == "answer") {
//     apiService("/webrtc2/isonline", { uuid: Template7.global.uuid }, function (
//       isZaixian
//     ) {
//       // 在线状态的可以接收通话请求
//       if (isZaixian) {
//         if (window.requsting) {
//           return;
//         }
//         window.callInterval && clearInterval(window.callInterval);
//         window.requsting = true;
//         setGlobalContext("receiveCall", msg.body);
//         var param = {
//           // openid: msg.body.openid,
//           type: msg.body.type,
//           id: msg.body.id,
//         };
//         apiService("/webrtc2/getroom", param, function (roomdata) {
//           setGlobalContext("roomInfo", roomdata);
//           if (window.calling) {
//             // 存储当前视频请求队列
//             var oldque = JSON.parse(window.sessionStorage.callQueue || "[]");
//             oldque.push(roomdata);
//             window.sessionStorage.callQueue = JSON.stringify(oldque);
//           } else {
//             // 关闭本地视频弹框
//             app.localVedio && app.localVedio.close();
//             window.savetimeout && clearTimeout(window.savetimeout);
//             $$("#mini-normal").hide();
//             $$("#mini-call").hide();
//             $$(".local-vedio-pop").hide(); // 本地视频隐藏
//             $$(".call-vedio-pop").hide();

//             // 播放语音
//             if (!window.amp3) {
//               window.amp3 = new Audio("./lib/trtc/call-vedio.mp3");
//               app.dialog.alert(
//                 "请操作点击该页面，允许自动播放视频通话语音提醒",
//                 function () {
//                   playCallAudio();
//                 }
//               );
//             } else {
//               playCallAudio();
//             }
//             setGlobalContext("answered", false); // 记录客服是否应答
//             // 显示弹框
//             $$("#call-request").show(); // 显示通话请求弹层
//             // $$('.app-hdpic').attr('src', ''); // 头像
//             $$(".app-nknm").html("停车用户"); // 昵称
//             requestTimeout && clearTimeout(requestTimeout);
//             // 1分钟后客服无应答直接关闭视频请求窗口
//             requestTimeout = setTimeout(function () {
//               if (!Template7.global.answered) {
//                 // handupCallByReason('timeout');
//                 closeVedioRequest();
//               }
//             }, 60 * 1000);
//           }
//         });
//       }
//     });
//   }
// }

// function sendCallMsgHandler() {
//   eb.send(
//     Template7.global.receiveCall.addr,
//     Object.assign(Template7.global.receiveCall, Template7.global.roomInfo),
//     {}
//   );
// }

// function playCallAudio() {
//   if (window.calling) {
//     return;
//   }
//   window.amp3.play();
//   window.amp3.onended = function () {
//     playCallAudio(); // 一直播放，直到接通
//   };
// }
