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
  scene.background = new THREE.Color(0x000000);
  
  // 반응형 캔버스 설정
  canvas = document.createElement('canvas');
  updateCanvasSize();
  ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  texture = new THREE.CanvasTexture(canvas);
  
  // 평면 크기도 반응형으로
  const planeWidth = window.innerWidth <= 480 ? 400 : 800;
  const planeHeight = window.innerWidth <= 480 ? 100 : 200;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // AsciiEffect 문자 세트와 옵션 조정
  const characters = ' .:-+*=%@#';
  const options = { 
    invert: true,
    color: 'white',
    backgroundColor: 'black',
    resolution: getAsciiResolution() // 해상도도 반응형으로
  };
  
  effect = new AsciiEffect(renderer, characters, options);
  effect.setSize(window.innerWidth, window.innerHeight);
  
  document.body.appendChild(effect.domElement);
  
  // DOM 요소에 직접 강력한 스타일 적용
  applyResponsiveStyles(effect.domElement);
  
  // 모든 자식 요소에도 스타일 적용
  setTimeout(() => {
    const allElements = effect.domElement.querySelectorAll('*');
    allElements.forEach(el => applyResponsiveStyles(el));
    
    // pre 태그가 있다면 특별 처리
    const preElements = effect.domElement.querySelectorAll('pre');
    preElements.forEach(pre => {
      applyResponsiveStyles(pre);
      pre.style.textAlign = 'center';
      pre.style.display = 'flex';
      pre.style.alignItems = 'center';
      pre.style.justifyContent = 'center';
    });
  }, 100);
  
  const clickableOverlay = document.getElementById('clickable-overlay');
  if (clickableOverlay) {
    clickableOverlay.style.cursor = 'pointer';
    clickableOverlay.addEventListener('click', () => {
      window.location.href = './project.html';
    });
  }
  
  window.addEventListener('resize', onWindowResize);
}

// 반응형 스타일을 직접 적용하는 함수
function applyResponsiveStyles(element) {
  if (!element) return;
  
  element.style.width = '100vw';
  element.style.height = '100vh';
  element.style.position = 'fixed';
  element.style.top = '0';
  element.style.left = '0';
  element.style.margin = '0';
  element.style.padding = '0';
  element.style.overflow = 'hidden';
  element.style.boxSizing = 'border-box';
  element.style.whiteSpace = 'pre';
  element.style.lineHeight = '1';
  element.style.fontFamily = 'monospace';
  element.style.color = 'white';
  element.style.backgroundColor = 'black';
  element.style.fontSize = getResponsiveFontSize() + 'px';
}

// ASCII 해상도 반응형 설정
function getAsciiResolution() {
  const width = window.innerWidth;
  if (width <= 480) return 0.1;  // 모바일: 낮은 해상도
  if (width <= 768) return 0.15; // 태블릿: 중간 해상도
  return 0.2; // 데스크탑: 높은 해상도
}

function updateCanvasSize() {
  const width = window.innerWidth;
  
  if (width <= 320) {
    canvas.width = 400;
    canvas.height = 100;
  } else if (width <= 480) {
    canvas.width = 600;
    canvas.height = 150;
  } else if (width <= 768) {
    canvas.width = 800;
    canvas.height = 200;
  } else {
    canvas.width = 1024;
    canvas.height = 256;
  }
}

function getResponsiveFontSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  if (width <= 320) {
    return Math.max(3, Math.min(width / 120, height / 150));
  } else if (width <= 480) {
    return Math.max(4, Math.min(width / 100, height / 120));
  } else if (width <= 768) {
    return Math.max(6, Math.min(width / 80, height / 100));
  } else {
    return Math.max(8, Math.min(width / 140, height / 80));
  }
}

function getResponsiveTextSize() {
  const width = window.innerWidth;
  
  if (width <= 320) {
    return Math.max(20, width / 16);
  } else if (width <= 480) {
    return Math.max(30, width / 14);
  } else if (width <= 768) {
    return Math.max(40, width / 12);
  } else {
    return 80;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
  
  // 리사이즈 시 업데이트
  updateCanvasSize();
  
  // DOM 요소 스타일 재적용
  applyResponsiveStyles(effect.domElement);
  
  // 모든 자식 요소에도 재적용
  const allElements = effect.domElement.querySelectorAll('*');
  allElements.forEach(el => applyResponsiveStyles(el));
}

function animate() {
  const elapsed = Date.now() - startTime;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const textSize = getResponsiveTextSize();
  ctx.font = `bold ${textSize}px "Monaco", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  // 애니메이션도 화면 크기에 맞게 조정
  const amplitude = window.innerWidth <= 480 ? 15 : 30;
  const y = canvas.height / 2 + Math.sin(elapsed * 0.003) * amplitude;
  ctx.fillText('Press Start', canvas.width / 2, y);
  
  texture.needsUpdate = true;
  
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {
  const menuSections = document.querySelectorAll('.menu-section-title');
  menuSections.forEach(menu => {
    menu.addEventListener('click', () => {
      menuSections.forEach(m => m.classList.remove('active'));
      menu.classList.add('active');
    });
  });
});

// 디버깅용 - 실제 생성된 DOM 요소 확인
setTimeout(() => {
  console.log('AsciiEffect domElement:', effect.domElement);
  console.log('Children:', effect.domElement.children);
  console.log('innerHTML preview:', effect.domElement.innerHTML.substring(0, 200));
  
  // 강제로 스타일 적용
  effect.domElement.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    font-size: ${Math.max(6, window.innerWidth / 100)}px !important;
    color: white !important;
    background: black !important;
    font-family: monospace !important;
    white-space: pre !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1 !important;
    z-index: 1 !important;
  `;
}, 500);