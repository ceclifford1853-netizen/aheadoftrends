import React, { useRef, useEffect } from "react";
import * as THREE from "three";
const DigitalOracleScene: React.FC = () => {
const mountRef = useRef<HTMLDivElement>(null);
useEffect(() => {
if (!mountRef.current) return;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000508);
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 12);
camera.lookAt(0, -2, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
mountRef.current.appendChild(renderer.domElement);
const globeGroup = new THREE.Group();
globeGroup.position.y = -10;
scene.add(globeGroup);
const baseGeometry = new THREE.SphereGeometry(13.95, 64, 64);
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x000c14 });
const globeBase = new THREE.Mesh(baseGeometry, baseMaterial);
globeGroup.add(globeBase);
const wireframeGeometry = new THREE.SphereGeometry(14, 64, 64);
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d9ff, wireframe: true, transparent: true, opacity: 0.04 });
const globeWireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
globeGroup.add(globeWireframe);
const lightsCount = 2200;
const lightsGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(lightsCount * 3);
const colors = new Float32Array(lightsCount * 3);
const baseColor = new THREE.Color(0xffaa22);
for (let i = 0; i < lightsCount; i++) {
  const phi = Math.acos(-1 + 2 * Math.random());
  const theta = 2 * Math.PI * Math.random();
  const radius = 14.01;
  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = radius * Math.cos(phi);
  const clr = baseColor.clone().convertSRGBToLinear();
  clr.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
  colors[i * 3] = clr.r;
  colors[i * 3 + 1] = clr.g;
  colors[i * 3 + 2] = clr.b;
}
lightsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
lightsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
const lightsMaterial = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.95 });
const cityLights = new THREE.Points(lightsGeometry, lightsMaterial);
globeGroup.add(cityLights);
const createAtmosphere = (radius: number, color: number, opacity: number) => {
  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, transparent: true, opacity, blending: THREE.AdditiveBlending });
  return new THREE.Mesh(geometry, material);
};
globeGroup.add(createAtmosphere(14.3, 0x00d9ff, 0.18));
globeGroup.add(createAtmosphere(14.8, 0x00f0ff, 0.10));
globeGroup.add(createAtmosphere(15.5, 0x0099cc, 0.05));
const starsCount = 1800;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i++) {
  starPositions[i * 3] = (Math.random() - 0.5) * 80;
  starPositions[i * 3 + 1] = Math.random() * 30 + 1;
  starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
}
starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);
const hudGroup = new THREE.Group();
scene.add(hudGroup);
for (let i = 0; i < 7; i++) {
  const y = -3 + i * 1.2;
  const width = 25;
  const vertices = [new THREE.Vector3(-width / 2, y, -5), new THREE.Vector3(width / 2, y, -5)];
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
  const material = new THREE.LineBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
  hudGroup.add(new THREE.Line(geometry, material));
}
const pulseGroup = new THREE.Group();
globeGroup.add(pulseGroup);
const ringsGeometry = new THREE.RingGeometry(0, 0.18, 16);
const spawnPulse = () => {
  const material = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const ringMesh = new THREE.Mesh(ringsGeometry, material);
  ringMesh.position.x = (Math.random() - 0.5) * 20;
  ringMesh.position.y = 10.5;
  ringMesh.position.z = Math.random() * 5 + 8;
  ringMesh.userData = { clock: new THREE.Clock(), phase: 0 };
  pulseGroup.add(ringMesh);
  setTimeout(() => { pulseGroup.remove(ringMesh); material.dispose(); }, 2000);
};
const pulseInterval = setInterval(spawnPulse, 2500);
const clock = new THREE.Clock();
const animate = () => {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);
  globeWireframe.rotation.y += 0.015 * delta;
  pulseGroup.children.forEach((child) => {
    const mesh = child as THREE.Mesh;
    const mat = mesh.material as THREE.MeshBasicMaterial;
    const time = mesh.userData.clock.getElapsedTime();
    mesh.lookAt(camera.position);
    const scale = 1 + (time / 2) * 2.5;
    mesh.scale.set(scale, scale, 1);
    const basePulse = Math.sin(time * Math.PI * 2);
    const normalizedPulse = (basePulse + 1) / 2;
    const fade = Math.max(0, 1 - (time / 2));
    mat.opacity = normalizedPulse * 0.15 * fade;
  });
  renderer.render(scene, camera);
};
animate();
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleResize);
return () => {
  clearInterval(pulseInterval);
  window.removeEventListener("resize", handleResize);
  renderer.dispose();
  ringsGeometry.dispose();
  baseGeometry.dispose();
  baseMaterial.dispose();
  wireframeGeometry.dispose();
  wireframeMaterial.dispose();
  lightsGeometry.dispose();
  lightsMaterial.dispose();
  starsGeometry.dispose();
  starsMaterial.dispose();
  if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
};
}, []);
return <div ref={mountRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }} />;
};
export default DigitalOracleScene;
