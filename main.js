import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

let camera, scene, renderer, effect;
let plane, texture, ctx, canvas;
const startTime = Date.now();

init();
animate();

function init() {
  // 사파리 감지 및 호환성 개선
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    console.log('Safari detected - applying compatibility fixes');
    
    // 사파리 렌더링 최적화
    document.documentElement.style.webkitFontSmoothing = 'antialiased';
    document.documentElement.style.webkitTransform = 'translateZ(0)';
    document.body.style.webkitFontSmoothing = 'antialiased';
    document.body.style.webkitTransform = 'translateZ(0)';
    document.body.style.willChange = 'transform';
    document.body.style.backfaceVisibility = 'hidden';

    // 사파리 특별 최적화
    document.body.style.webkitPerspective = '1000px';
    document.body.style.webkitTransformStyle = 'preserve-3d';
  }

  // 기본 배경 및 폰트 색상 설정
  document.body.style.background = 'black';
  document.body.style.color = 'transparent';
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';

  // 카메라 및 씬 초기화
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 400);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // 캔버스 크기 설정 (반응형)
  let canvasWidth, canvasHeight, fontSize;
  if (window.innerWidth <= 512) {
    canvasWidth = 512;
    canvasHeight = 128;
    fontSize = 40;
  } else if (window.innerWidth <= 768) {
    canvasWidth = 768;
    canvasHeight = 192;
    fontSize = 60;
  } else {
    canvasWidth = 1024;
    canvasHeight = 256;
    fontSize = 80;
  }

  // 텍스트용 오프스크린 canvas
  canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx = canvas.getContext('2d');

  // 사파리에서 캔버스 렌더링 최적화
  if (isSafari) {
    ctx.imageSmoothingEnabled = false;
    if (ctx.webkitImageSmoothingEnabled !== undefined) {
      ctx.webkitImageSmoothingEnabled = false;
    }
    // 사파리 캔버스 강제 리렌더링 방지
    ctx.save();
  }

  texture = new THREE.CanvasTexture(canvas);

  // 사파리에서 텍스처 최적화
  if (isSafari) {
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }

  // Plane의 크기를 캔버스 크기와 비슷하게 맞추어 중앙 정렬 효과 보장
  const geometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, -65, 0);
  scene.add(plane);

  // 렌더러 및 ASCII 이펙트 설정
  renderer = new THREE.WebGLRenderer({
    antialias: !isSafari, // 사파리에서는 안티앨리어싱 비활성화로 성능 개선
    powerPreference: isSafari ? 'high-performance' : 'default'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'black';

   // 사파리에서 ASCII Effect DOM 강화된 최적화
  if (isSafari) {
    effect.domElement.style.webkitFontSmoothing = 'antialiased';
    effect.domElement.style.webkitTransform = 'translateZ(0)';
    effect.domElement.style.willChange = 'transform';
    effect.domElement.style.webkitPerspective = '1000px';
    effect.domElement.style.webkitTransformStyle = 'preserve-3d';
    
    // 사파리에서 DOM 강제 리플로우 방지
    effect.domElement.style.contain = 'layout style paint';
    
    // 사파리에서 테이블 렌더링 강화된 최적화 (더 빠르게 적용)
    const optimizeTables = () => {
      const tables = effect.domElement.querySelectorAll('table');
      tables.forEach(table => {
        table.style.webkitFontSmoothing = 'antialiased';
        table.style.webkitTransform = 'translateZ(0)';
        table.style.willChange = 'transform';
        table.style.contain = 'layout style';
        
        // 테이블 셀들도 최적화
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
          cell.style.webkitTransform = 'translateZ(0)';
        });
      });
    };
    
    // 즉시 실행 + 지연 실행으로 이중 보장
    setTimeout(optimizeTables, 50);
    setTimeout(optimizeTables, 200);
    
    // 추가로 DOM 변화 감지해서 최적화 재적용
    const observer = new MutationObserver(optimizeTables);
    observer.observe(effect.domElement, { childList: true, subtree: true });
  }

  document.body.appendChild(effect.domElement);

  const clickableOverlay = document.getElementById('clickable-overlay');
  if (clickableOverlay) {
    clickableOverlay.addEventListener('click', () => {
      window.location.href = './project.html';
    });
  }

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  // 카메라 비율/매트릭스 갱신
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  console.log('animation loop running'); // 디버그용 로그
  const elapsed = Date.now() - startTime;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 크기별 반응형 텍스트 설정
  let textSize;
  if (window.innerWidth <= 480) {
    textSize = 30;
  } else if (window.innerWidth <= 768) {
    textSize = 50;
  } else {
    textSize = 80;
  }

  ctx.font = `bold ${textSize}px "Monaco", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';

  // 텍스트 중앙 및 약간의 위아래 애니메이션 효과
  const y = canvas.height / 2 + Math.sin(elapsed * 0.001) * 15;
  ctx.fillText('Press Start', canvas.width / 2, y);

  texture.needsUpdate = true;
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}