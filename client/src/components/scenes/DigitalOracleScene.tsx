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

    // 1. Solid Base
    const baseGeo = new THREE.SphereGeometry(13.9, 64, 64);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x000c14 });
    globeGroup.add(new THREE.Mesh(baseGeo, baseMat));

    // 2. Cyan Wireframe
    const wireGeo = new THREE.SphereGeometry(14, 64, 64);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, wireframe: true, transparent: true, opacity: 0.04 });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireframe);

    // 3. City Lights (2200 Particles)
    const lightsCount = 2200;
    const lightsGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(lightsCount * 3);
    const colors = new Float32Array(lightsCount * 3);
    const baseColor = new THREE.Color(0xffaa22);

    for (let i = 0; i < lightsCount; i++) {
      const phi = Math.acos(-1 + 2 * Math.random());
      const theta = 2 * Math.PI * Math.random();
      const r = 14.02;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = baseColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    lightsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    lightsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const cityLights = new THREE.Points(lightsGeo, new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending }));
    globeGroup.add(cityLights);

    // 4. Atmosphere layers
    const createAtmosphere = (radius: number, color: number, opacity: number) => {
      const geo = new THREE.SphereGeometry(radius, 64, 64);
      const mat = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, transparent: true, opacity, blending: THREE.AdditiveBlending });
      return new THREE.Mesh(geo, mat);
    };
    globeGroup.add(createAtmosphere(14.3, 0x00d9ff, 0.18));
    globeGroup.add(createAtmosphere(14.8, 0x00f0ff, 0.10));
    globeGroup.add(createAtmosphere(15.5, 0x0099cc, 0.05));

    // 5. Signal Pulse System
    const pulseGroup = new THREE.Group();
    globeGroup.add(pulseGroup);
    const ringGeo = new THREE.RingGeometry(0, 0.15, 16);

    const spawnPulse = () => {
      const mat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
      const pulse = new THREE.Mesh(ringGeo, mat);
      const phi = Math.acos(-1 + 2 * Math.random());
      const theta = 2 * Math.PI * Math.random();
      const r = 14.1;
      pulse.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      pulse.lookAt(new THREE.Vector3(0, 0, 0));
      pulse.userData = { time: 0 };
      pulseGroup.add(pulse);
      setTimeout(() => { pulseGroup.remove(pulse); mat.dispose(); }, 2000);
    };
    const interval = setInterval(spawnPulse, 600);

    // 6. Star field
    const starsCount = 1800;
    const starsGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 80;
      starPos[i * 3 + 1] = Math.random() * 30 + 1;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 0.1, color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })));

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = 0.01;
      wireframe.rotation.y += 0.0015;
      cityLights.rotation.y += 0.0015;
      pulseGroup.children.forEach(p => {
        p.userData.time += delta;
        const t = p.userData.time;
        p.scale.set(1 + t * 4, 1 + t * 4, 1);
        (p as THREE.Mesh).lookAt(camera.position);
        ((p as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.2 * (1 - t / 2);
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
};

export default DigitalOracleScene;
