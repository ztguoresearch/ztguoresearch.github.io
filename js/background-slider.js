// 背景图片轮播效果
document.addEventListener('DOMContentLoaded', function() {
  const images = [
    '/img/傍晚路灯.png',
    '/img/小白-煤炭镇.png',
    '/img/蜡笔小新-看电视.png'
  ];
  
  let currentIndex = 0;
  
  // 获取页面头部元素
  const pageHeader = document.getElementById('page-header');
  
  if (pageHeader) {
    // 设置初始背景
    pageHeader.style.backgroundImage = `url('${images[0]}')`;
    pageHeader.style.backgroundSize = 'cover';
    pageHeader.style.backgroundPosition = 'center';
    pageHeader.style.transition = 'background-image 1s ease-in-out';
    
    // 每5秒切换一次背景
    setInterval(function() {
      currentIndex = (currentIndex + 1) % images.length;
      pageHeader.style.backgroundImage = `url('${images[currentIndex]}')`;
    }, 5000);
  }
  
  // 同时设置 web_bg 背景（如果存在）
  const webBg = document.getElementById('web_bg');
  if (webBg) {
    webBg.style.backgroundImage = `url('${images[0]}')`;
    webBg.style.backgroundSize = 'cover';
    webBg.style.backgroundPosition = 'center';
    webBg.style.transition = 'background-image 1s ease-in-out';
    
    setInterval(function() {
      const bgIndex = Math.floor(Date.now() / 5000) % images.length;
      webBg.style.backgroundImage = `url('${images[bgIndex]}')`;
    }, 5000);
  }
});
