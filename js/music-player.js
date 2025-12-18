// 初始化 APlayer 音乐播放器 - 圆形固定样式，强制自动播放
document.addEventListener('DOMContentLoaded', function() {
  const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: true,
    theme: '#FF6B9D',
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.5,
    mutex: true,
    listFolded: true,
    listMaxHeight: 90,
    lrcType: 0,
    audio: [
      {
        name: 'Unpacking Loop',
        artist: 'Ycle',
        url: '/music/unpacking-loop-ycle-138250.mp3',
        cover: '/img/傍晚路灯.png'
      }
    ]
  });
  
  // 多重尝试确保音乐自动播放
  let playAttempted = false;
  
  // 方法1: 延迟播放
  setTimeout(function() {
    if (!playAttempted) {
      playAttempted = true;
      ap.play().catch(function() {
        console.log('第一次播放尝试失败，准备监听用户交互');
      });
    }
  }, 500);
  
  // 方法2: 监听 APlayer 初始化完成
  ap.on('canplay', function() {
    if (!playAttempted) {
      playAttempted = true;
      ap.play().catch(function() {
        console.log('canplay事件播放失败');
      });
    }
  });
  
  // 方法3: 用户交互时立即播放
  const autoPlayOnInteraction = function() {
    ap.play().then(function() {
      console.log('用户交互后成功播放');
      // 移除所有监听器
      document.removeEventListener('click', autoPlayOnInteraction);
      document.removeEventListener('touchstart', autoPlayOnInteraction);
      document.removeEventListener('keydown', autoPlayOnInteraction);
      document.removeEventListener('scroll', autoPlayOnInteraction);
      document.removeEventListener('mousemove', autoPlayOnInteraction);
    }).catch(function(error) {
      console.log('播放失败:', error);
    });
  };
  
  // 监听多种用户交互事件
  document.addEventListener('click', autoPlayOnInteraction, { once: true });
  document.addEventListener('touchstart', autoPlayOnInteraction, { once: true });
  document.addEventListener('keydown', autoPlayOnInteraction, { once: true });
  document.addEventListener('scroll', autoPlayOnInteraction, { once: true });
  document.addEventListener('mousemove', autoPlayOnInteraction, { once: true });
  
  // 方法4: 持续尝试播放（前3秒内）
  let retryCount = 0;
  const maxRetries = 6; // 3秒内尝试6次
  const retryInterval = setInterval(function() {
    retryCount++;
    if (retryCount >= maxRetries) {
      clearInterval(retryInterval);
      return;
    }
    
    if (ap.audio.paused) {
      ap.play().then(function() {
        console.log('重试播放成功');
        clearInterval(retryInterval);
      }).catch(function() {
        // 继续重试
      });
    } else {
      clearInterval(retryInterval);
    }
  }, 500);
});
