import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Produce3D({ produceType = 'apple', accentColor = '#D62828' }) {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ea, 2.0);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const produceGroup = new THREE.Group();
    scene.add(produceGroup);

    // Build geometry based on produce type
    const hexColor = parseInt(accentColor.replace('#', '0x')) || 0xd62828;
    const mat = new THREE.MeshStandardMaterial({
      color: hexColor,
      roughness: 0.35,
      metalness: 0.1
    });

    if (produceType.toLowerCase().includes('carrot')) {
      const geo = new THREE.ConeGeometry(0.35, 1.4, 16);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.z = Math.PI;
      produceGroup.add(mesh);
    } else if (produceType.toLowerCase().includes('squash') || produceType.toLowerCase().includes('pumpkin')) {
      const geo = new THREE.SphereGeometry(0.7, 24, 16);
      geo.scale(1.2, 0.75, 1.2);
      const mesh = new THREE.Mesh(geo, mat);
      produceGroup.add(mesh);
    } else {
      // Default Apple / Tomato
      const geo = new THREE.SphereGeometry(0.65, 28, 20);
      geo.scale(1, 0.9, 1);
      const mesh = new THREE.Mesh(geo, mat);
      produceGroup.add(mesh);

      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 6);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x582f0e });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.65;
      produceGroup.add(stem);
    }

    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      produceGroup.rotation.y += deltaX * 0.015;
      produceGroup.rotation.x += deltaY * 0.015;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) {
        produceGroup.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [produceType, accentColor]);

  if (!hasWebGL) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '2rem' }}>🌿</span>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '180px',
        cursor: 'grab',
        position: 'relative'
      }}
      title="Click and drag to rotate in 3D"
    />
  );
}
