import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/AfterimagePass.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

let w = window.innerWidth;
let h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.06);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 15;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// effects
const renderScene = new RenderPass(scene, camera);
                                      // resolution, strength, radius, threshold
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 3.0, 0, 0);

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.975;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(afterImagePass);

const ballGeo = new THREE.IcosahedronGeometry(8, 2);
const verts = [];
const colors = [];
let col;
const ballVerts = ballGeo.vertices;
const numVerts = ballVerts.length;
for (let i = 0; i < numVerts; i += 1) {
  let p = ballVerts[i];
  col = new THREE.Color().setHSL(0.5 + p.x * 0.025 + 0, 1.0, 0.5);
  verts.push(p.x, p.y, p.z);
  colors.push(col.r, col.g, col.b);
}
const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
const mat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
const points = new THREE.Points(geo, mat);
scene.add(points);

function animate() {
  requestAnimationFrame(animate);
  points.rotation.x += 0.0075;
  points.rotation.y += 0.005;
  composer.render(scene, camera);
}

animate();

function handleWindowResize () {
  w = window.innerWidth;
  h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);