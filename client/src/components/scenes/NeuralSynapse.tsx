import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralSynapse() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020010, 0.025);
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.set(0, 0, 18);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Neural nodes
    const NODE_COUNT = 120;
    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ));
    }

    // Node particles
    const nodePosArr = new Float32Array(NODE_COUNT * 3);
    nodePositions.forEach((v, i) => { nodePosArr[i*3]=v.x; nodePosArr[i*3+1]=v.y; nodePosArr[i*3+2]=v.z; });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    const nodeMat = new THREE.PointsMaterial({ color: 0x9933ff, size: 0.25, transparent: true, opacity: 1.0 });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    // Fiber connections between nearby nodes
    const MAX_DIST = 7;
    const fiberVerts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < MAX_DIST) {
          fiberVerts.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          fiberVerts.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const fiberGeo = new THREE.BufferGeometry();
    fiberGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(fiberVerts), 3));
    const fiberMat = new THREE.LineBasicMaterial({ color: 0x4400aa, transparent: true, opacity: 0.35 });
    const fibers = new THREE.LineSegments(fiberGeo, fiberMat);
    scene.add(fibers);

    // Violet accent particles (smaller, faster)
    const accentCount = 500;
    const accentPos = new Float32Array(accentCount * 3);
    const accentVel: number[] = [];
    for (let i = 0; i < accentCount; i++) {
      accentPos[i*3]   = (Math.random() - 0.5) * 40;
      accentPos[i*3+1] = (Math.random() - 0.5) * 30;
      accentPos[i*3+2] = (Math.random() - 0.5) * 30;
      accentVel.push((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
    }
    const accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
    const accentParticles = new THREE.Points(accentGeo, new THREE.PointsMaterial({ color: 0xcc44ff, size: 0.06, transparent: true, opacity: 0.7 }));
    scene.add(accentParticles);

    let t = 0, id: number;
    const animate = () => {
      id = requestAnimationFrame(animate);
      t += 0.008;
      // Pulse node opacity
      nodeMat.opacity = 0.7 + Math.sin(t * 2) * 0.3;
      // Rotate the whole neural web slowly
      nodes.rotation.y = t * 0.08;
      fibers.rotation.y = t * 0.08;
      nodes.rotation.x = Math.sin(t * 0.3) * 0.15;
      fibers.rotation.x = Math.sin(t * 0.3) * 0.15;
      // Drift accent particles
      const ap = accentGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < accentCount; i++) {
        (ap.array as Float32Array)[i*3]   += accentVel[i*3];
        (ap.array as Float32Array)[i*3+1] += accentVel[i*3+1];
        (ap.array as Float32Array)[i*3+2] += accentVel[i*3+2];
        if (Math.abs((ap.array as Float32Array)[i*3]) > 20) accentVel[i*3] *= -1;
        if (Math.abs((ap.array as Float32Array)[i*3+1]) > 15) accentVel[i*3+1] *= -1;
        if (Math.abs((ap.array as Float32Array)[i*3+2]) > 15) accentVel[i*3+2] *= -1;
      }
      ap.needsUpdate = true;
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
