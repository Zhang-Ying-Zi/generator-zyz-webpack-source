/* eslint-disable require-jsdoc */

function addView(id) {
  if (!$('#' + id)[0]) {
    $('<div/>', {
      id,
      class: 'video-view'
    }).appendTo('#video_live');
  }
}

function removeView(id) {
  if ($('#' + id)[0]) {
    $('#' + id).remove();
  }
}

var cameras, microphones;
// populate camera options
TRTC.getCameras().then(devices => {
  cameras = devices;
  window.camras = devices;
});

// populate microphone options
TRTC.getMicrophones().then(devices => {
  microphones = devices;
});

// TRTC.getSpeakers().then(devices => {
//   microphones = devices;
// });

function getCameraId() {
  console.log('default cameraId: ' + cameras[0].deviceId);
  return cameras[0].deviceId;
}

function getMicrophoneId() {
  console.log('default microphoneId: ' + microphones[0].deviceId);
  return microphones[0].deviceId;
}

function isPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

// fix jquery touchstart event warn in chrome M76
jQuery.event.special.touchstart = {
  setup: function(_, ns, handle) {
    if (ns.includes('noPreventDefault')) {
      this.addEventListener('touchstart', handle, { passive: false });
    } else {
      this.addEventListener('touchstart', handle, { passive: true });
    }
  }
};
jQuery.event.special.touchmove = {
  setup: function(_, ns, handle) {
    if (ns.includes('noPreventDefault')) {
      this.addEventListener('touchmove', handle, { passive: false });
    } else {
      this.addEventListener('touchmove', handle, { passive: true });
    }
  }
};
