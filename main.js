import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

let camera, scene, renderer, effect;
let plane, texture, ctx, canvas;
const startTime = Date.now();

init();
animate();

function init() {
  // 브라우저 감지 (디버깅용)
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  
  console.log('Browser detected:', { isChrome, isSafari, isFirefox });

  // 모든 브라우저에 안정성 강화 적용
  document.documentElement.style.webkitFontSmoothing = 'antialiased';
  document.documentElement.style.mozOsxFontSmoothing = 'grayscale';
  
  document.body.style.cssText = `
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: black;
    color: transparent;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  `;

  // Three.js 초기화
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 400);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // 반응형 캔버스 크기
  let canvasWidth, canvasHeight;
  if (window.innerWidth <= 512) {
    canvasWidth = 512;
    canvasHeight = 128;
  } else if (window.innerWidth <= 768) {
    canvasWidth = 768;
    canvasHeight = 192;
  } else {
    canvasWidth = 1024;
    canvasHeight = 256;
  }

  // 텍스트 캔버스 생성
  canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx = canvas.getContext('2d');

  // 모든 브라우저에서 캔버스 최적화
  ctx.imageSmoothingEnabled = false;
  if (ctx.webkitImageSmoothingEnabled !== undefined) {
    ctx.webkitImageSmoothingEnabled = false;
  }
  if (ctx.mozImageSmoothingEnabled !== undefined) {
    ctx.mozImageSmoothingEnabled = false;
  }

  texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Plane 생성
  const geometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
  const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: true,
    alphaTest: 0.1
  });
  plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, -65, 0);
  scene.add(plane);

  // 렌더러 설정 (모든 브라우저 최적화)
  renderer = new THREE.WebGLRenderer({
    antialias: false, // 모든 브라우저에서 끄기
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true, // 모든 브라우저에서 켜기
    alpha: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // AsciiEffect 생성
  console.log('Creating AsciiEffect...');
  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  
  // DOM 기본 스타일
  effect.domElement.style.cssText = `
    color: white !important;
    background-color: black !important;
    font-smoothing: antialiased !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
    will-change: transform !important;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    contain: layout style paint !important;
  `;

  document.body.appendChild(effect.domElement);
  console.log('AsciiEffect DOM added to body');

  // 범용 DOM 안정화 시스템 (모든 브라우저)
  const universalStabilization = () => {
    const tables = effect.domElement.querySelectorAll('table');
    
    if (tables.length > 0) {
      console.log(`Stabilizing ${tables.length} tables for all browsers`);
      
      tables.forEach((table, index) => {
        // 모든 브라우저에서 테이블 안정화
        table.style.cssText += `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 10 !important;
          color: white !important;
          background: black !important;
          font-smoothing: antialiased !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          transform: translateZ(0) !important;
          -webkit-transform: translateZ(0) !important;
          will-change: transform !important;
          contain: layout style !important;
        `;
        
        // 테이블 셀들도 최적화
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
          cell.style.cssText += `
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
            font-smoothing: antialiased !important;
            -webkit-font-smoothing: antialiased !important;
          `;
        });
      });
    }
  };

  // 다단계 안정화 (모든 브라우저에 적용)
  setTimeout(universalStabilization, 50);
  setTimeout(universalStabilization, 200);
  setTimeout(universalStabilization, 500);
  
  // 주기적 안정화 (모든 브라우저)
  setInterval(() => {
    const tables = effect.domElement.querySelectorAll('table');
    tables.forEach(table => {
      // 미세한 transform 변경으로 렌더링 강제 업데이트
      table.style.transform = 'translateZ(0.001px)';
      setTimeout(() => {
        table.style.transform = 'translateZ(0px)';
      }, 10);
    });
  }, 200); // 200ms마다

  // DOM 변화 감시 (모든 브라우저)
  const observer = new MutationObserver(() => {
    setTimeout(universalStabilization, 20);
  });
  observer.observe(effect.domElement, { 
    childList: true, 
    subtree: true, 
    attributes: true 
  });

  // 클릭 이벤트
  const clickableOverlay = document.getElementById('clickable-overlay');
  if (clickableOverlay) {
    clickableOverlay.addEventListener('click', () => {
      window.location.href = './project.html';
    });
  }

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  console.log('animation loop running');
  const elapsed = Date.now() - startTime;

  // 캔버스에 텍스트 그리기
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 반응형 텍스트 크기
  let textSize;
  if (window.innerWidth <= 480) {
    textSize = 60;
  } else if (window.innerWidth <= 768) {
    textSize = 80;
  } else {
    textSize = 90;
  }

  ctx.font = `bold ${textSize}px "Monaco", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';

  // 애니메이션 텍스트
  const y = canvas.height / 2 + Math.sin(elapsed * 0.001) * 15;
  ctx.fillText('Press Start', canvas.width / 2, y);

  texture.needsUpdate = true;
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}