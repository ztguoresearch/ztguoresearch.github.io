// 初始化 APlayer 音乐播放器 - 圆形固定样式
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
});
