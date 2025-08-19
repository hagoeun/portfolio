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
    scene.background = new THREE.Color(0x000000);  // 씬 배경 검정

    // 캔버스 생성 및 초기 세팅
    canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    ctx = canvas.getContext('2d');

    // 텍스처 생성
    texture = new THREE.CanvasTexture(canvas);

    // 평면에 텍스처 적용
    const geometry = new THREE.PlaneGeometry(800, 200);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);

    effect.domElement.style.color = 'white';           // 글자 흰색
    effect.domElement.style.backgroundColor = 'black'; // 배경 검정

    document.body.appendChild(effect.domElement);

    // 기존에 cursor, 클릭 이벤트는 오버레이 div에서 처리하므로 제거

    // 오버레이 클릭 이벤트 등록 (HTML에서 #clickable-overlay가 있어야 함)
    const clickableOverlay = document.getElementById('clickable-overlay');
    if (clickableOverlay) {
        clickableOverlay.style.cursor = 'pointer';
        clickableOverlay.addEventListener('click', () => {
            window.location.href = '/'; // 원하는 새 페이지 경로
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
    const elapsed = Date.now() - startTime;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 80px "Monaco", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    const y = canvas.height / 2 + Math.sin(elapsed * 0.003) * 30;
    ctx.fillText('Press Start', canvas.width / 2, y);

    texture.needsUpdate = true;

    effect.render(scene, camera);
    requestAnimationFrame(animate);
}
