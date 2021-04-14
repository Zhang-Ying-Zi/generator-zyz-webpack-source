function formatCallDuring(millseconds, hasHour) {
  var secondTime = parseInt(millseconds / 1000); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime >= 60) {
    minuteTime = parseInt(secondTime / 60);
    secondTime = parseInt(secondTime % 60);
    if (minuteTime >= 60) {
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var timestr =
    ((hourTime > 0 && hourTime.toString().padStart(2, "0") + ":") ||
      (hasHour ? "00:" : "")) +
    (minuteTime.toString().padStart(2, "0") + ":") +
    secondTime.toString().padStart(2, "0");
  return timestr;
}

function clearDatePickerClass() {
  $("#ui-datepicker-div")
    .removeClass("filter-time-year")
    .removeClass("filter-time-month")
    .removeClass("month-year-select");
}

/** 初始化日期组件，可弹出日期选择框 */
function initDate(ref, options) {
  var node = $(".date-item");
  if (ref) {
    node = ref;
  }
  clearDatePickerClass();

  node.datepicker("destroy");
  node.datepicker({
    beforeShow: function (input, instance) {
      $("#ui-datepicker-div").addClass("month-year-select");
    },
    dateFormat: "yy-mm-dd",
    showMonthAfterYear: true,
    changeMonth: true,
    changeYear: true,
  });
  if (options) {
    Object.keys(options).forEach(function (okey) {
      node.datepicker("option", okey, options[okey]);
    });
  }
  node.datepicker(
    "option",
    "dayNames",
    WEEK_DAY.map(function (day) {
      return "周" + day;
    })
  );
  node.datepicker("option", "dayNamesMin", WEEK_DAY);
  node.datepicker("option", "dayNamesShort", WEEK_DAY);
  node.datepicker("option", "monthNames", MONTH_NAME);
  node.datepicker("option", "monthNamesShort", MONTH_NAME);
}

/** 初始化日期时间组件，可弹出日期【含时分秒】选择框 */
function initDatetime(ref) {
  var node = $(".date-item");
  if (ref) {
    node = ref;
  }
  clearDatePickerClass();
  node.datepicker("destroy");
  node.datetimepicker({
    beforeShow: function (input, instance) {
      // 年月可下拉，设置样式
      $("#ui-datepicker-div").addClass("month-year-select");
    },
    dateFormat: "yy-mm-dd",
    timeFormat: "HH:mm:ss",
    dayNames: WEEK_DAY.map(function (day) {
      return "周" + day;
    }),
    dayNamesMin: WEEK_DAY,
    dayNamesShort: WEEK_DAY,
    monthNames: MONTH_NAME,
    monthNamesShort: MONTH_NAME,
    showMonthAfterYear: true,
    changeMonth: true,
    changeYear: true,
    timeText: "时间",
    hourText: "小时",
    minuteText: "分钟",
    secondText: "秒",
    currentText: "当前时间",
    closeText: "确认",
    hourText: "小时",
    hourText: "小时",
  });
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

Template7.registerHelper("dateformat", function (millseconds, format, isSecd) {
  var d = new Date(isSecd ? millseconds * 1000 : millseconds);
  return (millseconds && d.format(format)) || "";
});

var apiPrix = baseConfig.service.api;

/** v2接口调用 */
function apiService(appendurl, fdata, callback, errorcallback) {
  if (!window.localStorage.kftoken) return;

  app.preloader.show();
  app.request({
    url: apiPrix + appendurl,
    method: "POST",
    processData: true,
    contentType: "application/json",
    async: false,
    timeout: 30,
    headers: {
      Authentication: "Bearer " + window.localStorage.kftoken,
    },
    data: fdata,
    success: function (data, status, xhr) {
      app.preloader.hide();
      var r = JSON.parse(data).r;
      if (callback) callback(r);
    },
    error: function (xhr) {
      app.preloader.hide();
      if (xhr.status == 401) {
        app.dialog.alert("凭证过期，请重新登录", function () {
          jkzxLogout();
        });
      } else {
        // 退出登录，已退出了，直接退出
        if (
          appendurl.indexOf("serviceOver") !== -1 &&
          xhr.responseText.indexOf("未加入接听队列") !== -1
        ) {
          jkzxLogout();
          return;
        }
        app.dialog.alert(xhr.responseText, function () {
          if (errorcallback) errorcallback(xhr.responseText);
        });
      }
    },
  });
}

/** 请求文件流接口，默认接收内容为blob */
function blobApiService(appendurl, fdata) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();

    req.open("POST", apiPrix + appendurl, true);
    req.responseType = "blob";
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader(
      "Authentication",
      "Bearer " + window.localStorage.kftoken
    );

    req.onload = function () {
      var data = req.response;
      if (req.status == 200) {
        resolve(data);
      } else {
        if (data.type == "application/json") {
          var reader = new FileReader();
          reader.readAsText(data, "utf-8");
          reader.onload = function (e) {
            var result = JSON.parse(e.target.result);
            reject((result && result.error) || "服务端出错");
          };
        } else {
          reject("服务端出错");
        }
      }
    };
    req.onerror = function () {
      app.dialog.alert("服务端出错");
    };
    req.send(JSON.stringify(fdata));
  });
}

function openMyAlert(title, func) {
  if (app && app.dialog) {
    app.dialog.alert(title, function () {
      func && func();
    });
    return;
  }

  alert(title);
  func && func();
}

/** 关闭视频通话请求，恢复正常状态 */
function closeVedioRequest() {
  window.amp3 && window.amp3.pause();
  window.callInterval && clearInterval(window.callInterval);
  window.requsting = false;
  $$(".dialog").remove();
  $$(".with-modal-popup").removeClass("with-modal-popup");
  $$(".with-modal-dialog").removeClass("with-modal-dialog");
  $$(".popup").hide();
  $$(".backdrop-in").remove();

  $$("#mini-call").hide();
  $$("#call-request").hide();
  $$("#mini-normal").show();
}

/** 结束通话【结束原因】  */
function handupCallByReason(refuse, callbackFunc) {
  var param = {
    // reason: reason,
    refuse: refuse,
    sn: Template7.global.receiveCall.sn || 0,
  };
  apiService("/webrtc2/hangupz", param, function () {
    if (callbackFunc) {
      callbackFunc();
    } else {
      closeVedioRequest();
    }
  });
}
