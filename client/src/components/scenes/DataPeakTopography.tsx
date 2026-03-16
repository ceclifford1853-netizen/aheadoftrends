import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DataPeakTopography() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050008, 0.022);
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 300);
    camera.position.set(0, 6, 20);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Build terrain grid
    const COLS = 60, ROWS = 60, SPACING = 1.2;
    const terrainGeo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const colors: number[] = [];
    const heights: number[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - COLS / 2) * SPACING;
        const z = (r - ROWS / 2) * SPACING;
        const h = Math.sin(c * 0.4) * Math.cos(r * 0.3) * 3
                + Math.sin(c * 0.15 + 1) * Math.sin(r * 0.2) * 5
                + (Math.random() - 0.5) * 0.5;
        heights.push(h);
        verts.push(x, h, z);
        // Color: magenta at peaks, dark purple at valleys
        const t = Math.max(0, Math.min(1, (h + 5) / 10));
        colors.push(t * 1.0, 0, t * 0.8 + (1 - t) * 0.1);
      }
    }

    // Build wireframe lines
    const lineVerts: number[] = [];
    const lineColors: number[] = [];
    const idx = (r: number, c: number) => r * COLS + c;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = idx(r, c);
        const x = (c - COLS / 2) * SPACING;
        const z = (r - ROWS / 2) * SPACING;
        const h = heights[i];
        const t = Math.max(0, Math.min(1, (h + 5) / 10));
        const cr = t, cg = 0, cb = t * 0.8 + (1 - t) * 0.1;
        if (c + 1 < COLS) {
          const j = idx(r, c + 1);
          lineVerts.push(x, h, z, (c+1-COLS/2)*SPACING, heights[j], z);
          lineColors.push(cr, cg, cb, cr, cg, cb);
        }
        if (r + 1 < ROWS) {
          const j = idx(r + 1, c);
          lineVerts.push(x, h, z, x, heights[j], (r+1-ROWS/2)*SPACING);
          lineColors.push(cr, cg, cb, cr, cg, cb);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3));
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7 });
    const terrain = new THREE.LineSegments(lineGeo, lineMat);
    terrain.position.y = -4;
    scene.add(terrain);

    // Floating magenta peak particles
    const peakCount = 300;
    const peakPos = new Float32Array(peakCount * 3);
    for (let i = 0; i < peakCount; i++) {
      peakPos[i*3]   = (Math.random() - 0.5) * 40;
      peakPos[i*3+1] = Math.random() * 8 - 2;
      peakPos[i*3+2] = (Math.random() - 0.5) * 40;
    }
    const peakGeo = new THREE.BufferGeometry();
    peakGeo.setAttribute('position', new THREE.BufferAttribute(peakPos, 3));
    scene.add(new THREE.Points(peakGeo, new THREE.PointsMaterial({ color: 0xff00cc, size: 0.08, transparent: true, opacity: 0.8 })));

    let t = 0;
    let id: number;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.004;
      // Slow forward drift
      terrain.position.z = (t * 2) % (ROWS * SPACING);
      // Animate heights for data "pulse"
      const pos = lineGeo.attributes.position as THREE.BufferAttribute;
      // subtle wave on terrain
      terrain.rotation.y = Math.sin(t * 0.2) * 0.05;
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
