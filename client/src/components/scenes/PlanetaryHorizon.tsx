import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PlanetaryHorizon() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000a12, 0.012);
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.set(0, 4, 14);
    camera.lookAt(0, -4, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // === CURVED EARTH HORIZON at y = -10 ===
    const earthGeo = new THREE.SphereGeometry(28, 64, 64);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x001a2e, wireframe: false, side: THREE.BackSide });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(0, -10, 0);
    scene.add(earth);

    // Wireframe overlay
    const horizonGeo = new THREE.SphereGeometry(28.1, 40, 40);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, wireframe: true, transparent: true, opacity: 0.06 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.position.set(0, -10, 0);
    scene.add(horizon);

    // === CITY LIGHTS ===
    const cityCount = 800;
    const cityPos = new Float32Array(cityCount * 3);
    const cityColors = new Float32Array(cityCount * 3);
    const sphereR = 28.2;
    for (let i = 0; i < cityCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      cityPos[i * 3] = sphereR * Math.sin(phi) * Math.cos(theta);
      cityPos[i * 3 + 1] = sphereR * Math.cos(phi) - 10;
      cityPos[i * 3 + 2] = sphereR * Math.sin(phi) * Math.sin(theta);
      const warm = Math.random() > 0.5;
      cityColors[i * 3] = warm ? 1.0 : 0.0;
      cityColors[i * 3 + 1] = warm ? 0.9 : 0.85;
      cityColors[i * 3 + 2] = warm ? 0.5 : 1.0;
    }
    const cityGeo = new THREE.BufferGeometry();
    cityGeo.setAttribute('position', new THREE.BufferAttribute(cityPos, 3));
    cityGeo.setAttribute('color', new THREE.BufferAttribute(cityColors, 3));
    const cityMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.9 });
    scene.add(new THREE.Points(cityGeo, cityMat));

    // === ATMOSPHERIC GLOW ===
    const glowGeo = new THREE.TorusGeometry(28.5, 0.8, 8, 80);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.1 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, -10, 0);
    glow.rotation.x = Math.PI / 2;
    scene.add(glow);

    // === STARS ===
    const starCount = 1500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.6 })));

    // === TINY DEVICE PARTICLES (phones, tablets, screens) ===
    // Small bright rectangles scattered in space representing devices
    const deviceCount = 120;
    const deviceGroup = new THREE.Group();
    const deviceData: { mesh: THREE.Mesh; speed: number; phase: number; baseY: number }[] = [];
    for (let i = 0; i < deviceCount; i++) {
      const w = 0.04 + Math.random() * 0.06;
      const h = 0.06 + Math.random() * 0.08;
      const geo = new THREE.PlaneGeometry(w, h);
      const isCyan = Math.random() > 0.4;
      const mat = new THREE.MeshBasicMaterial({
        color: isCyan ? 0x00d9ff : 0xff00ff,
        transparent: true,
        opacity: 0.0, // start invisible, will spark in
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      deviceGroup.add(mesh);
      deviceData.push({
        mesh,
        speed: 0.5 + Math.random() * 2.0,
        phase: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      });
    }
    scene.add(deviceGroup);

    // === SIGNAL / LIGHTNING BOLTS ===
    // Lines that spark between random points, bright then fade
    const maxBolts = 25;
    const bolts: { line: THREE.Line; life: number; maxLife: number; decay: number }[] = [];
    const boltGroup = new THREE.Group();
    scene.add(boltGroup);

    function createBolt() {
      const segments = 4 + Math.floor(Math.random() * 6);
      const points: THREE.Vector3[] = [];
      const startX = (Math.random() - 0.5) * 30;
      const startY = (Math.random() - 0.5) * 15;
      const startZ = (Math.random() - 0.5) * 20;
      let x = startX, y = startY, z = startZ;
      for (let s = 0; s <= segments; s++) {
        points.push(new THREE.Vector3(x, y, z));
        x += (Math.random() - 0.5) * 3;
        y += (Math.random() - 0.5) * 2;
        z += (Math.random() - 0.5) * 2;
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const isCyan = Math.random() > 0.3;
      const mat = new THREE.LineBasicMaterial({
        color: isCyan ? 0x00d9ff : 0xff00ff,
        transparent: true,
        opacity: 1.0,
      });
      const line = new THREE.Line(geo, mat);
      boltGroup.add(line);
      bolts.push({ line, life: 1.0, maxLife: 1.0, decay: 0.01 + Math.random() * 0.03 });
    }

    let elapsed = 0;
    const clock = new THREE.Clock();
    let id: number;

    const animate = () => {
      id = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      elapsed += dt;

      // Rotate earth slowly
      earth.rotation.y += 0.0006;
      horizon.rotation.y += 0.0006;

      // === DEVICE SPARK ANIMATION ===
      // Devices spark in bright then slowly fade — slower as animation continues
      const slowFactor = Math.max(0.15, 1.0 / (1.0 + elapsed * 0.08));
      for (const d of deviceData) {
        const t = elapsed * d.speed * slowFactor + d.phase;
        const sparkCycle = Math.sin(t);
        // Spark: bright peak then fade
        const mat = d.mesh.material as THREE.MeshBasicMaterial;
        if (sparkCycle > 0.85) {
          mat.opacity = Math.min(1.0, (sparkCycle - 0.85) * 6.67);
        } else if (sparkCycle > 0.3) {
          mat.opacity = Math.max(0.0, (sparkCycle - 0.3) * 0.5);
        } else {
          mat.opacity *= 0.97;
        }
        // Gentle float
        d.mesh.position.y = d.baseY + Math.sin(t * 0.3) * 0.3;
      }

      // === LIGHTNING BOLT ANIMATION ===
      // Spawn rate slows down over time
      const spawnRate = Math.max(0.02, 0.15 * slowFactor);
      if (Math.random() < spawnRate && bolts.length < maxBolts) {
        createBolt();
      }
      // Update bolts — decay slows over time
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life -= b.decay * slowFactor;
        (b.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, b.life);
        if (b.life <= 0) {
          boltGroup.remove(b.line);
          b.line.geometry.dispose();
          (b.line.material as THREE.LineBasicMaterial).dispose();
          bolts.splice(i, 1);
        }
      }

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
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />;
}
