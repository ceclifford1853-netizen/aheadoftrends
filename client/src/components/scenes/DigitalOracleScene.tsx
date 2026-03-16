import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const DigitalOracleScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000305);

    // Camera positioned to show the curved horizon filling the lower 60% of screen
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 3.5, 10);
    camera.lookAt(0, -3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    // Large globe at y=-10 so only the top arc (horizon) is visible
    globeGroup.position.y = -10;
    scene.add(globeGroup);

    // === 1. SOLID DARK BASE (occludes stars behind globe) ===
    const baseGeo = new THREE.SphereGeometry(13.85, 64, 64);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x000810 });
    globeGroup.add(new THREE.Mesh(baseGeo, baseMat));

    // === 2. SUBTLE WIREFRAME GRID ===
    const wireGeo = new THREE.SphereGeometry(14, 48, 48);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff, wireframe: true, transparent: true, opacity: 0.025
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireframe);

    // === 3. CITY LIGHTS — clustered to simulate continents ===
    const lightsCount = 3500;
    const lightsGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(lightsCount * 3);
    const colors = new Float32Array(lightsCount * 3);

    // Continent cluster centers (phi, theta) — Europe, N.America, Asia, etc.
    const clusters = [
      { phi: 1.1, theta: 0.3, spread: 0.5, count: 700 },   // Europe
      { phi: 1.0, theta: -1.3, spread: 0.6, count: 600 },  // N. America
      { phi: 1.2, theta: 2.2, spread: 0.7, count: 800 },   // Asia
      { phi: 1.4, theta: 1.5, spread: 0.4, count: 400 },   // Middle East
      { phi: 1.5, theta: -0.5, spread: 0.5, count: 300 },  // N. Africa
      { phi: 1.8, theta: -0.8, spread: 0.4, count: 200 },  // S. America
      { phi: 1.6, theta: 2.8, spread: 0.3, count: 200 },   // SE Asia
      { phi: 1.9, theta: 2.5, spread: 0.3, count: 300 },   // Australia
    ];

    let idx = 0;
    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count && idx < lightsCount; i++, idx++) {
        const phi = cluster.phi + (Math.random() - 0.5) * cluster.spread;
        const theta = cluster.theta + (Math.random() - 0.5) * cluster.spread;
        const r = 14.02;
        pos[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[idx * 3 + 2] = r * Math.cos(phi);

        // Warm orange-yellow city light colors
        const warm = Math.random();
        colors[idx * 3] = 0.9 + warm * 0.1;       // R
        colors[idx * 3 + 1] = 0.55 + warm * 0.25; // G
        colors[idx * 3 + 2] = 0.05 + warm * 0.1;  // B
      }
    });
    // Fill remaining with sparse random lights
    while (idx < lightsCount) {
      const phi = Math.acos(-1 + 2 * Math.random());
      const theta = 2 * Math.PI * Math.random();
      const r = 14.02;
      pos[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[idx * 3 + 2] = r * Math.cos(phi);
      colors[idx * 3] = 0.85; colors[idx * 3 + 1] = 0.5; colors[idx * 3 + 2] = 0.05;
      idx++;
    }

    lightsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    lightsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const cityLights = new THREE.Points(lightsGeo, new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }));
    globeGroup.add(cityLights);

    // === 4. ATMOSPHERE LAYERS — strong cyan glow matching reference ===
    const addAtmo = (radius: number, color: number, opacity: number) => {
      const geo = new THREE.SphereGeometry(radius, 64, 64);
      const mat = new THREE.MeshBasicMaterial({
        color, side: THREE.BackSide, transparent: true, opacity,
        blending: THREE.AdditiveBlending
      });
      globeGroup.add(new THREE.Mesh(geo, mat));
    };
    addAtmo(14.25, 0x00eeff, 0.30); // Inner bright cyan rim
    addAtmo(14.6,  0x00ccff, 0.18); // Mid glow
    addAtmo(15.2,  0x0088cc, 0.10); // Outer haze
    addAtmo(16.0,  0x004466, 0.06); // Deep atmosphere

    // === 5. SIGNAL PULSES — faint cyan rings every 2.5s ===
    const pulseGroup = new THREE.Group();
    globeGroup.add(pulseGroup);
    const ringGeo = new THREE.RingGeometry(0, 0.12, 16);

    const spawnPulse = () => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00eeff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide
      });
      const pulse = new THREE.Mesh(ringGeo, mat);
      // Spawn on visible upper hemisphere (phi near equator)
      const phi = 0.8 + Math.random() * 0.6;
      const theta = 2 * Math.PI * Math.random();
      const r = 14.1;
      pulse.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      pulse.lookAt(new THREE.Vector3(0, 0, 0));
      pulse.userData = { time: 0 };
      pulseGroup.add(pulse);
      setTimeout(() => { pulseGroup.remove(pulse); mat.dispose(); }, 2200);
    };

    // Spawn 3 immediately, then every 2.5s
    spawnPulse(); spawnPulse(); spawnPulse();
    const pulseInterval = setInterval(spawnPulse, 2500);

    // === 6. STAR FIELD ===
    const starsCount = 2500;
    const starsGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = Math.random() * 80 + 5;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200 - 20;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      size: 0.12, color: 0xffffff, transparent: true, opacity: 0.75,
      blending: THREE.AdditiveBlending
    })));

    // === 7. HUD GRID LINES (subtle cyan horizontal lines across viewport) ===
    const hudGroup = new THREE.Group();
    scene.add(hudGroup);
    for (let i = 0; i < 6; i++) {
      const y = -4 + i * 2;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, y, -5),
        new THREE.Vector3(20, y, -5)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.04 });
      hudGroup.add(new THREE.Line(lineGeo, lineMat));
    }

    // === RESIZE HANDLER ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // === ANIMATION LOOP ===
    const animate = () => {
      requestAnimationFrame(animate);
      wireframe.rotation.y += 0.0008;
      cityLights.rotation.y += 0.0008;

      pulseGroup.children.forEach(p => {
        p.userData.time += 0.012;
        const t = p.userData.time;
        const scale = 1 + t * 5;
        p.scale.set(scale, scale, 1);
        (p as THREE.Mesh).lookAt(camera.position);
        const opacity = Math.sin(t * Math.PI * 0.8) * 0.18 * Math.max(0, 1 - t * 0.7);
        ((p as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacity;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearInterval(pulseInterval);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
  );
};

export default DigitalOracleScene;
