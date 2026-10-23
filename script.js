import * as THREE from 'three';
import { profile } from './data.js';

// Skills come from data.js
const SKILLS = (profile.skills && profile.skills.length > 1) ? profile.skills : ['Skill 1', 'Skill 2'];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060f, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 14);

// Lights
scene.add(new THREE.AmbientLight(0x6666aa, 0.8));
const p1 = new THREE.PointLight(0x7c5cff, 60, 60); p1.position.set(8, 6, 8); scene.add(p1);
const p2 = new THREE.PointLight(0x00e5ff, 60, 60); p2.position.set(-8, -6, 6); scene.add(p2);

// Central torus knot
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(2, 0.55, 220, 32),
  new THREE.MeshStandardMaterial({ color: 0x7c5cff, metalness: 0.7, roughness: 0.25, emissive: 0x1a1066 })
);
knot.position.set(4.5, 0, 0);
scene.add(knot);

const wire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(3.6, 1),
  new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.18 })
);
wire.position.copy(knot.position);
scene.add(wire);

// Orbiting skill labels (canvas-drawn sprites placed on a sphere)
function makeLabel(text) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(10, 12, 32, 0.75)';
  g.strokeStyle = 'rgba(0, 229, 255, 0.8)';
  g.lineWidth = 4;
  g.beginPath(); g.roundRect(6, 6, 500, 116, 58); g.fill(); g.stroke();
  g.fillStyle = '#e8eaf6';
  g.font = '600 52px Segoe UI, Arial, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(2.4, 0.6, 1);
  return sprite;
}

const orbit = new THREE.Group();
orbit.position.copy(knot.position);
scene.add(orbit);
const n = SKILLS.length;
SKILLS.forEach((name, i) => {
  const y = 1 - (i / (n - 1)) * 2;             // fibonacci sphere
  const r = Math.sqrt(1 - y * y);
  const theta = Math.PI * (3 - Math.sqrt(5)) * i;
  const s = makeLabel(name);
  s.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(5.2);
  orbit.add(s);
});

// Starfield
const starCount = 1800;
const pos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 120;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 10;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xaab4ff, size: 0.12, transparent: true, opacity: 0.8 }));
scene.add(stars);

// Interaction
const mouse = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // keep the model visible on narrow screens
  const narrow = window.innerWidth < 800;
  knot.position.x = narrow ? 0 : 4.5;
  wire.position.copy(knot.position);
  orbit.position.copy(knot.position);
});
window.dispatchEvent(new Event('resize'));

const clock = new THREE.Clock();
let targetX = 0, targetY = 0;

function animate() {
  const t = clock.getElapsedTime();
  const p = scrollProgress();

  if (!reduceMotion) {
    knot.rotation.x = t * 0.25 + p * 6;
    knot.rotation.y = t * 0.35;
    wire.rotation.y = -t * 0.12;
    orbit.rotation.y = t * 0.15 + p * 4;
    stars.rotation.y = t * 0.01;
  }

  // scroll flies the camera through the scene; mouse adds parallax
  targetX += (mouse.x * 1.5 - targetX) * 0.05;
  targetY += (-mouse.y * 1.0 - targetY) * 0.05;
  camera.position.x = targetX + Math.sin(p * Math.PI * 2) * 2;
  camera.position.y = targetY + (p - 0.5) * 3;
  camera.position.z = 14 - p * 5;
  camera.lookAt(knot.position.x * 0.4, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
