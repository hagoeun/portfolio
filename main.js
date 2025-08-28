import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

let camera, scene, renderer, effect;
let plane, texture, ctx, canvas;
const startTime = Date.now();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // 씬 배경 검정
  
  // 캔버스 생성 및 반응형 크기 설정
  canvas = document.createElement('canvas');
  updateCanvasSize(); // 반응형 캔버스 크기 설정 함수 호출
  ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  // 텍스처 생성
  texture = new THREE.CanvasTexture(canvas);
  
  // 평면에 텍스처 적용 (반응형 크기)
  const geometry = new THREE.PlaneGeometry(800, 200);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = 'white'; // 글자 흰색
  effect.domElement.style.backgroundColor = 'black'; // 배경 검정
  
  // AsciiEffect 요소 반응형 스타일 적용
  effect.domElement.style.width = '100vw';
  effect.domElement.style.height = '100vh';
  effect.domElement.style.position = 'fixed';
  effect.domElement.style.top = '0';
  effect.domElement.style.left = '0';
  effect.domElement.style.overflow = 'hidden';
  effect.domElement.style.fontSize = getResponsiveFontSize() + 'px';
  effect.domElement.style.lineHeight = '1';
  effect.domElement.style.whiteSpace = 'pre';
  effect.domElement.style.fontFamily = 'monospace';
  
  document.body.appendChild(effect.domElement);
  
  // 기존에 cursor, 클릭 이벤트는 오버레이 div에서 처리하므로 제거
  // 오버레이 클릭 이벤트 등록 (HTML에서 #clickable-overlay가 있어야 함)
  const clickableOverlay = document.getElementById('clickable-overlay');
  if (clickableOverlay) {
    clickableOverlay.style.cursor = 'pointer';
    clickableOverlay.addEventListener('click', () => {
      window.location.href = './project.html'; // 원하는 새 페이지 경로
    });
  }
  
  window.addEventListener('resize', onWindowResize);
}

// 반응형 캔버스 크기 설정 함수
function updateCanvasSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // 모바일에서는 작은 캔버스 사용
  if (width <= 480) {
    canvas.width = 512;
    canvas.height = 128;
  } else if (width <= 768) {
    canvas.width = 768;
    canvas.height = 192;
  } else {
    canvas.width = 1024;
    canvas.height = 256;
  }
}

// 반응형 폰트 크기 계산 함수
function getResponsiveFontSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  if (width <= 320) {
    return Math.max(4, Math.min(width / 80, height / 100));
  } else if (width <= 480) {
    return Math.max(6, Math.min(width / 70, height / 90));
  } else if (width <= 768) {
    return Math.max(8, Math.min(width / 60, height / 80));
  } else {
    return Math.max(10, Math.min(width / 120, height / 60));
  }
}

// 반응형 텍스트 크기 계산 함수
function getResponsiveTextSize() {
  const width = window.innerWidth;
  
  if (width <= 320) {
    return 30;
  } else if (width <= 480) {
    return 40;
  } else if (width <= 768) {
    return 60;
  } else {
    return 80;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
  
  // 리사이즈 시 캔버스와 폰트 크기 업데이트
  updateCanvasSize();
  effect.domElement.style.fontSize = getResponsiveFontSize() + 'px';
  effect.domElement.style.width = '100vw';
  effect.domElement.style.height = '100vh';
}

function animate() {
  const elapsed = Date.now() - startTime;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 반응형 폰트 크기 적용
  const textSize = getResponsiveTextSize();
  ctx.font = `bold ${textSize}px "Monaco", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  const y = canvas.height / 2 + Math.sin(elapsed * 0.003) * 30;
  ctx.fillText('Press Start', canvas.width / 2, y);
  
  texture.needsUpdate = true;
  
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {
  const menuSections = document.querySelectorAll('.menu-section-title');
  menuSections.forEach(menu => {
    menu.addEventListener('click', () => {
      // 모든 메뉴에서 active 제거
      menuSections.forEach(m => m.classList.remove('active'));
      // 클릭한 메뉴에만 active 추가
      menu.classList.add('active');
    });
  });
});