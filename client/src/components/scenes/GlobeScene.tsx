import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 300);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Globe wireframe at y = -6
    const globeGeo = new THREE.SphereGeometry(5, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, wireframe: true, transparent: true, opacity: 0.18 });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(0, -6, 0);
    scene.add(globe);

    // Hot-pink particles flying toward camera (z-axis)
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count); // z velocity per particle
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
      vel[i] = 0.04 + Math.random() * 0.12;
    }
    const partGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    partGeo.setAttribute('position', posAttr);
    const partMat = new THREE.PointsMaterial({ color: 0xff00aa, size: 0.1, transparent: true, opacity: 0.85 });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    let id: number;
    const animate = () => {
      id = requestAnimationFrame(animate);
      globe.rotation.y += 0.003;
      globe.rotation.x += 0.001;
      // Move particles toward camera
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 2] += vel[i];
        if (pos[i * 3 + 2] > 12) {
          pos[i * 3 + 2] = -50;
          pos[i * 3]     = (Math.random() - 0.5) * 30;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', onResize); mount.removeChild(renderer.domElement); renderer.dispose(); };
  }, []);
  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />;
}
