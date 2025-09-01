import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

let camera, scene, renderer, effect;
let plane, texture, ctx, canvas;
const startTime = Date.now();

init();
animate();

function init() {
  // 사파리 감지
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isSafari) {
    console.log('🦊 Safari detected - starting debug mode');
  }

  // 기본 설정
  document.body.style.background = 'black';
  document.body.style.color = 'transparent';
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';

  // Three.js 초기화
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 400);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // 캔버스 크기 설정
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

  // 텍스트 캔버스
  canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx = canvas.getContext('2d');

  texture = new THREE.CanvasTexture(canvas);

  // Plane 생성
  const geometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, -65, 0);
  scene.add(plane);

  // 렌더러 생성
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // AsciiEffect 생성
  console.log('🔧 Creating AsciiEffect...');
  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = 'white';
  effect.domElement.style.backgroundColor = 'black';

  // 🔍 DOM 상태 디버깅
  console.log('📊 AsciiEffect DOM created:', {
    tagName: effect.domElement.tagName,
    children: effect.domElement.children.length,
    style: effect.domElement.style.cssText,
    display: getComputedStyle(effect.domElement).display,
    visibility: getComputedStyle(effect.domElement).visibility,
    opacity: getComputedStyle(effect.domElement).opacity
  });

  // DOM에 추가
  document.body.appendChild(effect.domElement);
  console.log('✅ AsciiEffect DOM added to body');

  // 추가 후 DOM 상태 재확인
  setTimeout(() => {
    console.log('📊 DOM status after 1 second:', {
      bodyChildren: document.body.children.length,
      effectInDOM: document.body.contains(effect.domElement),
      effectDisplay: getComputedStyle(effect.domElement).display,
      effectVisibility: getComputedStyle(effect.domElement).visibility,
      tables: effect.domElement.querySelectorAll('table').length,
      tableVisible: effect.domElement.querySelectorAll('table')[0] ? 
        getComputedStyle(effect.domElement.querySelectorAll('table')[0]).display : 'no table'
    });

    // 사파리에서 테이블 강제 표시
    if (isSafari) {
      const tables = effect.domElement.querySelectorAll('table');
      console.log(`🔧 Safari: Found ${tables.length} tables for optimization`);
      
      tables.forEach((table, index) => {
        const beforeStyle = getComputedStyle(table);
        
        table.style.cssText = `
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
        `;
        
        const afterStyle = getComputedStyle(table);
        console.log(`🔧 Table ${index} style change:`, {
          before: { display: beforeStyle.display, visibility: beforeStyle.visibility },
          after: { display: afterStyle.display, visibility: afterStyle.visibility }
        });
      });
    }
  }, 1000);

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
  console.log('animation loop running'); // 기존 로그 유지
  const elapsed = Date.now() - startTime;

  // 캔버스 그리기
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 텍스트 크기 설정
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

  // 텍스트 그리기
  const y = canvas.height / 2 + Math.sin(elapsed * 0.001) * 15;
  ctx.fillText('Press Start', canvas.width / 2, y);

  texture.needsUpdate = true;
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}