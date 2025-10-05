/**
 * 3D球形标签云效果
 * 基于 TagCanvas 实现
 */

(function() {
  'use strict';

  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTagCloud);
  } else {
    initTagCloud();
  }

  function initTagCloud() {
    // 只在侧边栏标签云应用3D效果，不影响标签页面
    // 确保不是在标签页面（/tags/）
    if (window.location.pathname.includes('/tags/')) {
      console.log('标签页面，不应用3D效果');
      return;
    }
    
    // 尝试多个选择器找到侧边栏标签云
    let sidebarTagCloud = document.querySelector('#aside-content .card-tag-cloud');
    if (!sidebarTagCloud) {
      sidebarTagCloud = document.querySelector('.card-tag-cloud');
    }
    
    if (!sidebarTagCloud) {
      console.log('侧边栏标签云容器未找到');
      return;
    }
    
    // 确保找到的是侧边栏的标签云，不是页面主体的
    if (!sidebarTagCloud.closest('#aside-content')) {
      console.log('不是侧边栏标签云，跳过');
      return;
    }

    console.log('初始化侧边栏3D标签云...');

    // 创建canvas容器（侧边栏版本 - 增大到2倍）
    const canvasWrapper = document.createElement('div');
    canvasWrapper.id = 'sidebar-tagcloud-wrapper';
    canvasWrapper.style.cssText = `
      width: 100%;
      min-height: 700px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 10px;
      background: transparent;
      margin: 20px 0;
    `;

    // 创建canvas（增大到2倍：800x800）
    const canvas = document.createElement('canvas');
    canvas.id = 'sidebar-tagcloud-canvas';
    canvas.width = 800;
    canvas.height = 800;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';

    canvasWrapper.appendChild(canvas);

    // 获取侧边栏的所有标签
    const tags = Array.from(sidebarTagCloud.querySelectorAll('a'));
    if (tags.length === 0) {
      console.log('侧边栏没有找到标签');
      return;
    }

    console.log(`找到 ${tags.length} 个侧边栏标签`);

    // 创建标签数据（增大到2倍字体）
    const tagData = tags.map(tag => ({
      text: tag.textContent.trim(),
      url: tag.href,
      size: 20 + Math.random() * 16, // 20-36px (增大到2倍)
      color: getRandomColor()
    }));

    // 隐藏原始标签列表
    sidebarTagCloud.style.display = 'none';

    // 在侧边栏标签卡片中插入canvas
    const cardWidget = sidebarTagCloud.closest('.card-widget');
    if (cardWidget) {
      cardWidget.appendChild(canvasWrapper);
    }

    // 初始化3D标签云
    init3DTagCloud(canvas, tagData);
  }

  function init3DTagCloud(canvas, tagData) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2; // 增大球体半径到画布的1/2

    // 3D标签对象
    const tags3D = tagData.map((tag, index) => {
      const phi = Math.acos(-1 + (2 * index) / tagData.length);
      const theta = Math.sqrt(tagData.length * Math.PI) * phi;
      
      return {
        text: tag.text,
        url: tag.url,
        size: tag.size,
        color: tag.color,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        alpha: 1
      };
    });

    let angleX = 0;
    let angleY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let velocityX = 0.001;
    let velocityY = 0.001;

    // 鼠标事件
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        velocityX = deltaY * 0.001;
        velocityY = deltaX * 0.001;
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // 触摸事件（移动端）
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      isDragging = true;
      lastMouseX = touch.clientX;
      lastMouseY = touch.clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastMouseX;
        const deltaY = touch.clientY - lastMouseY;
        
        velocityX = deltaY * 0.001;
        velocityY = deltaX * 0.001;
        
        lastMouseX = touch.clientX;
        lastMouseY = touch.clientY;
      }
    });

    canvas.addEventListener('touchend', () => {
      isDragging = false;
    });

    // 点击跳转
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 检查点击是否在某个标签上
      for (const tag of tags3D) {
        const scale = (radius + tag.z) / (2 * radius);
        const x2d = centerX + tag.x * scale;
        const y2d = centerY + tag.y * scale;
        
        ctx.font = `${tag.size * scale}px Arial`;
        const textWidth = ctx.measureText(tag.text).width;
        const textHeight = tag.size * scale;
        
        if (x >= x2d - textWidth / 2 && x <= x2d + textWidth / 2 &&
            y >= y2d - textHeight / 2 && y <= y2d + textHeight / 2) {
          window.location.href = tag.url;
          break;
        }
      }
    });

    // 旋转函数
    function rotateX(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      tags3D.forEach(tag => {
        const y = tag.y * cos - tag.z * sin;
        const z = tag.z * cos + tag.y * sin;
        tag.y = y;
        tag.z = z;
      });
    }

    function rotateY(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      tags3D.forEach(tag => {
        const x = tag.x * cos - tag.z * sin;
        const z = tag.z * cos + tag.x * sin;
        tag.x = x;
        tag.z = z;
      });
    }

    // 渲染函数
    function render() {
      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 自动旋转（如果不拖拽）
      if (!isDragging) {
        angleX += velocityX;
        angleY += velocityY;
        rotateX(velocityX);
        rotateY(velocityY);
      } else {
        rotateX(velocityX);
        rotateY(velocityY);
      }

      // 按z轴深度排序
      tags3D.sort((a, b) => b.z - a.z);

      // 绘制标签
      tags3D.forEach(tag => {
        const scale = (radius + tag.z) / (2 * radius);
        const x2d = centerX + tag.x * scale;
        const y2d = centerY + tag.y * scale;
        const fontSize = tag.size * scale;
        
        // 根据深度调整透明度和大小
        tag.alpha = 0.3 + 0.7 * scale;
        
        ctx.save();
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = tag.color;
        ctx.globalAlpha = tag.alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 添加阴影效果
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(tag.text, x2d, y2d);
        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    // 开始渲染
    render();

    console.log('3D标签云初始化完成！');
  }

  function getRandomColor() {
    const colors = [
      '#49b1f5', '#ff6b9d', '#c4e3f3', '#ffa502', '#ff6348',
      '#1e90ff', '#ff69b4', '#00d8d6', '#f368e0', '#5f27cd',
      '#00b894', '#fdcb6e', '#6c5ce7', '#fd79a8', '#a29bfe',
      '#e17055', '#74b9ff', '#55efc4', '#fab1a0', '#dfe6e9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  console.log('3D标签云脚本已加载');
})();

