import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DigitalRain() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 200);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Vertical rain streams — each stream is a column of particles
    const STREAMS = 80;
    const PARTICLES_PER_STREAM = 30;
    const TOTAL = STREAMS * PARTICLES_PER_STREAM;
    const positions = new Float32Array(TOTAL * 3);
    const colors = new Float32Array(TOTAL * 3);
    const speeds: number[] = [];
    const streamX: number[] = [];
    const streamZ: number[] = [];

    for (let s = 0; s < STREAMS; s++) {
      const x = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 10;
      streamX.push(x);
      streamZ.push(z);
      const speed = 0.08 + Math.random() * 0.18;
      speeds.push(speed);
      const isCyan = Math.random() > 0.35;
      for (let p = 0; p < PARTICLES_PER_STREAM; p++) {
        const idx = (s * PARTICLES_PER_STREAM + p);
        positions[idx*3]   = x;
        positions[idx*3+1] = (Math.random() - 0.5) * 30;
        positions[idx*3+2] = z;
        // Head = bright, tail = dim
        const brightness = 1 - (p / PARTICLES_PER_STREAM) * 0.85;
        if (isCyan) {
          colors[idx*3]   = 0;
          colors[idx*3+1] = brightness;
          colors[idx*3+2] = brightness;
        } else {
          colors[idx*3]   = brightness;
          colors[idx*3+1] = 0;
          colors[idx*3+2] = brightness * 0.44;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.92 });
    const rain = new THREE.Points(geo, mat);
    scene.add(rain);

    // Horizontal scan lines (subtle)
    for (let i = 0; i < 8; i++) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, (i - 4) * 4, 0),
        new THREE.Vector3(20, (i - 4) * 4, 0),
      ]);
      scene.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.04 })));
    }

    let id: number;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const animate = () => {
      id = requestAnimationFrame(animate);
      for (let s = 0; s < STREAMS; s++) {
        const spd = speeds[s];
        for (let p = 0; p < PARTICLES_PER_STREAM; p++) {
          const idx = s * PARTICLES_PER_STREAM + p;
          (pos.array as Float32Array)[idx*3+1] -= spd;
          if ((pos.array as Float32Array)[idx*3+1] < -15) {
            (pos.array as Float32Array)[idx*3+1] = 15 + Math.random() * 5;
          }
        }
      }
      pos.needsUpdate = true;
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
