// 统一的背景图片和音乐初始化脚本

// 等待页面完全加载
window.addEventListener('load', function() {
  
  // ========== 背景图片轮播同步 ==========
  const images = [
    '/img/傍晚路灯.png',
    '/img/小白-煤炭镇.png',
    '/img/蜡笔小新-看电视.png'
  ];
  
  let currentImageIndex = 0;
  
  // 设置背景图片的函数
  function setBackgroundImage(index) {
    const imageUrl = images[index];
    
    // 1. 设置首页顶部图
    const pageHeader = document.getElementById('page-header');
    if (pageHeader) {
      pageHeader.style.backgroundImage = `url('${imageUrl}')`;
      pageHeader.style.backgroundSize = 'cover';
      pageHeader.style.backgroundPosition = 'center center';
      pageHeader.style.backgroundAttachment = 'fixed';
      pageHeader.style.transition = 'background-image 1.5s ease-in-out';
    }
    
    // 2. 设置整体背景
    const webBg = document.getElementById('web_bg');
    if (webBg) {
      webBg.style.backgroundImage = `url('${imageUrl}')`;
      webBg.style.backgroundSize = 'cover';
      webBg.style.backgroundPosition = 'center center';
      webBg.style.backgroundAttachment = 'fixed';
      webBg.style.transition = 'background-image 1.5s ease-in-out';
    }
    
    // 3. 设置 body 背景（确保覆盖所有情况）
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.transition = 'background-image 1.5s ease-in-out';
    
    console.log('背景已切换到图片 ' + (index + 1) + ':', imageUrl);
  }
  
  // 立即设置初始背景
  setBackgroundImage(0);
  
  // 每5秒同步切换背景
  setInterval(function() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    setBackgroundImage(currentImageIndex);
  }, 5000);
  
  console.log('背景图片轮播已启动');
  
  
  // ========== 音乐播放器强制自动播放 ==========
  
  // 等待 APlayer 初始化
  setTimeout(function() {
    const aplayerContainer = document.getElementById('aplayer');
    if (!aplayerContainer) {
      console.log('APlayer 容器未找到');
      return;
    }
    
    // 查找 APlayer 实例
    let playerInstance = null;
    
    // 方法1: 从全局变量获取
    if (window.aplayers && window.aplayers.length > 0) {
      playerInstance = window.aplayers[0];
    }
    
    // 方法2: 从容器获取
    if (!playerInstance && aplayerContainer.aplayer) {
      playerInstance = aplayerContainer.aplayer;
    }
    
    // 尝试播放的函数
    function attemptPlay() {
      if (!playerInstance) return;
      
      try {
        const audio = playerInstance.audio;
        if (audio && audio.paused) {
          const playPromise = playerInstance.play();
          if (playPromise !== undefined) {
            playPromise.then(function() {
              console.log('✅ 音乐自动播放成功！');
            }).catch(function(error) {
              console.log('❌ 自动播放被阻止:', error.message);
            });
          }
        }
      } catch (e) {
        console.log('播放尝试出错:', e);
      }
    }
    
    // 多次尝试播放
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(function() {
      retryCount++;
      
      // 重新查找实例
      if (!playerInstance) {
        if (window.aplayers && window.aplayers.length > 0) {
          playerInstance = window.aplayers[0];
        } else if (aplayerContainer.aplayer) {
          playerInstance = aplayerContainer.aplayer;
        }
      }
      
      if (playerInstance) {
        attemptPlay();
        
        // 如果正在播放，停止重试
        const audio = playerInstance.audio;
        if (audio && !audio.paused) {
          console.log('✅ 音乐播放确认成功，停止重试');
          clearInterval(retryInterval);
          return;
        }
      }
      
      if (retryCount >= maxRetries) {
        console.log('⏰ 达到最大重试次数，等待用户交互');
        clearInterval(retryInterval);
      }
    }, 800);
    
    // 用户交互后播放
    const interactionHandler = function() {
      console.log('🖱️ 检测到用户交互，尝试播放音乐');
      
      // 重新查找实例
      if (!playerInstance) {
        if (window.aplayers && window.aplayers.length > 0) {
          playerInstance = window.aplayers[0];
        } else if (aplayerContainer.aplayer) {
          playerInstance = aplayerContainer.aplayer;
        }
      }
      
      if (playerInstance) {
        attemptPlay();
        
        // 检查是否播放成功
        setTimeout(function() {
          const audio = playerInstance.audio;
          if (audio && !audio.paused) {
            console.log('✅ 用户交互后播放成功，移除监听器');
            // 移除所有事件监听器
            document.removeEventListener('click', interactionHandler);
            document.removeEventListener('touchstart', interactionHandler);
            document.removeEventListener('keydown', interactionHandler);
            document.removeEventListener('scroll', interactionHandler);
          }
        }, 500);
      }
    };
    
    // 监听多种用户交互
    document.addEventListener('click', interactionHandler);
    document.addEventListener('touchstart', interactionHandler);
    document.addEventListener('keydown', interactionHandler);
    document.addEventListener('scroll', interactionHandler);
    
    console.log('🎵 音乐自动播放脚本已加载');
    
  }, 1500); // 等待1.5秒确保 APlayer 完全初始化
  
});

console.log('✅ 自定义初始化脚本已加载');
