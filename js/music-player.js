// 初始化 APlayer 音乐播放器 - 圆形固定样式，自动播放
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
  
  // 尝试自动播放，如果浏览器阻止，则在用户第一次交互时播放
  setTimeout(function() {
    ap.play().catch(function(error) {
      console.log('自动播放被阻止，等待用户交互...');
      // 监听用户的第一次点击事件
      const autoPlayOnInteraction = function() {
        ap.play();
        document.removeEventListener('click', autoPlayOnInteraction);
        document.removeEventListener('touchstart', autoPlayOnInteraction);
        document.removeEventListener('keydown', autoPlayOnInteraction);
      };
      document.addEventListener('click', autoPlayOnInteraction);
      document.addEventListener('touchstart', autoPlayOnInteraction);
      document.addEventListener('keydown', autoPlayOnInteraction);
    });
  }, 1000);
});
