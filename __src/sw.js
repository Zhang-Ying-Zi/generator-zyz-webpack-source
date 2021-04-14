var cacheKey = 'xgjkzx-cache-v1.0.2';     // 缓存的名称  
var cacheList = [
  'img/bg_login.png',
  'img/icon_online.png',
  'img/icon_leave.png',
  'img/bg_spth.jpg',
  'img/timg.jpg',
  'img/icon_lvl_0.png',
  'img/icon_lvl_1.png',
  'img/icon_lvl_2.png',
  'img/icon_lvl_3.png',
  'img/icon_camera.png',
  'img/icon_call.png',
  'img/icon_prompt.png',
  'img/logo_text.png',
  'img/icon_dropout.png',
  'img/btn_hangup.png',
  'img/btn_answer.png',
  'lib/css/framework7.md.min.css',
  'lib/css/jquery-ui.min.css',
  'lib/framework7-4.4.0.min.js',
  'lib/jquery-1.12.4.min.js',
  'lib/jquery-ui.min.js',
  'lib/jquery.timepicker.addon.js',
  'lib/jquery.hoverIntent.minified.js',
  'lib/sockjs.min.js',
  'lib/vertx-eventbus.js',
  'lib/trtc/call-vedio.mp3',
  'lib/trtc/trtc.js',
  'manifest.json',
  'index.html',
];

// install 事件，它发生在浏览器安装并注册 Service Worker 时        
self.addEventListener('install', function (event) {
  /* event.waitUtil 用于在安装成功之前执行一些预装逻辑
   但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率
   安装成功后 ServiceWorker 状态会从 installing 变为 installed */
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      cache.addAll(cacheList);
    })
    // .then(function() {
    //   return self.skipWaiting();
    // })
  );
});

/**
  为 fetch 事件添加一个事件监听器。
*/
self.addEventListener('fetch', function (event) {
  // 使用 caches.match() 来检查传入的请求是否在当前缓存中,存在则返回缓存资源。
  // 否则通过网络来获取资源,获取后加入缓存中
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  )
});

// 当前浏览器没有激活的service worker或者已经激活的worker被解雇，
// 新的service worker进入activate事件
self.addEventListener('activate', function (event) {
  console.log('event: activate!');
  var cacheWhitelist = [cacheKey];
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});


