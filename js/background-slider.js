// 背景图片轮播效果 - 同步首页顶部图和背景图
document.addEventListener('DOMContentLoaded', function() {
  const images = [
    '/img/傍晚路灯.png',
    '/img/小白-煤炭镇.png',
    '/img/蜡笔小新-看电视.png'
  ];
  
  let currentIndex = 0;
  
  // 获取页面头部元素和背景元素
  const pageHeader = document.getElementById('page-header');
  const webBg = document.getElementById('web_bg');
  
  // 统一设置背景图片的函数
  function setBackgroundImage(index) {
    const imageUrl = `url('${images[index]}')`;
    
    if (pageHeader) {
      pageHeader.style.backgroundImage = imageUrl;
      pageHeader.style.backgroundSize = 'cover';
      pageHeader.style.backgroundPosition = 'center';
      pageHeader.style.transition = 'background-image 1s ease-in-out';
    }
    
    if (webBg) {
      webBg.style.backgroundImage = imageUrl;
      webBg.style.backgroundSize = 'cover';
      webBg.style.backgroundPosition = 'center';
      webBg.style.transition = 'background-image 1s ease-in-out';
    }
  }
  
  // 设置初始背景
  setBackgroundImage(0);
  
  // 每5秒同步切换一次背景（首页顶部图和背景图同时切换）
  setInterval(function() {
    currentIndex = (currentIndex + 1) % images.length;
    setBackgroundImage(currentIndex);
  }, 5000);
});
