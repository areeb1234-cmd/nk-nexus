import React, { useState, useEffect, useRef, useMemo, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import HarvestBasket3D from './HarvestBasket3D';

// ---------------------------------------------------------------------------
// Error Boundary to catch any WebGL/Canvas runtime crashes gracefully
// ---------------------------------------------------------------------------
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL/R3F Scroll Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Glowing Ground Market Anchor (Follows underneath the basket with pulse)
// ---------------------------------------------------------------------------
function GlowingGroundMarker({ position = [0, -1.35, 0] }) {
  const pulseRingRef = useRef();
  const innerRingRef = useRef();
  const haloLightRef = useRef();
  const beaconRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rhythmic expansion of outer glowing radar pulse
    if (pulseRingRef.current) {
      const scale = 1 + Math.sin(t * 1.8) * 0.18;
      pulseRingRef.current.scale.set(scale, scale, 1);
      pulseRingRef.current.material.opacity = 0.52 - Math.sin(t * 1.8) * 0.16;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.15;
    }

    if (haloLightRef.current) {
      haloLightRef.current.intensity = 1.8 + Math.sin(t * 1.8) * 0.5;
    }

    if (beaconRef.current) {
      beaconRef.current.position.y = 0.14 + Math.sin(t * 1.4) * 0.03;
      beaconRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Wooden Market Display Platform Base */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.15, 0.12, 32]} />
        <meshStandardMaterial color="#3d2616" roughness={0.9} />
      </mesh>

      {/* Primary Glowing Floor Ring Anchor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.2, 1.32, 48]} />
        <meshBasicMaterial
          color="#52b788"
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Rotating Calibration Ring */}
      <group ref={innerRingRef} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.75, 0.8, 32]} />
          <meshBasicMaterial
            color="#74c69d"
            transparent
            opacity={0.68}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Center Floor Anchor Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial
          color="#b7e4c7"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulsing Outer Radiance Ring */}
      <mesh
        ref={pulseRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry args={[1.4, 1.55, 48]} />
        <meshBasicMaterial
          color="#74c69d"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Glowing Market Location Pin / Beacon */}
      <group ref={beaconRef} position={[0, 0.14, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial
            color="#52b788"
            emissive="#74c69d"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.045, 0.1, 6]} />
          <meshBasicMaterial color="#b7e4c7" />
        </mesh>
      </group>

      {/* Upward Glowing Floor Anchor Light */}
      <pointLight
        ref={haloLightRef}
        position={[0, 0.35, 0]}
        color="#74c69d"
        intensity={2.0}
        distance={3.5}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scroll Choreographer Component (Directs 3D Basket transforms as page scrolls)
// ---------------------------------------------------------------------------
function ScrollChoreographer({ onHoverProduce, activeProduce, isAutoSpin }) {
  const basketGroupRef = useRef();
  const { size } = useThree();
  const isMobile = size.width < 768;

  // Waypoints for the 3D basket at key scroll percentages
  // [progress, posX, posY, posZ, rotX, rotY, rotZ, scale]
  const waypoints = useMemo(() => {
    if (isMobile) {
      // Mobile-friendly waypoints: centered/subtle offset, scaled down
      return [
        { progress: 0.0, pos: [0.0, 0.45, -0.2], rot: [0.22, -0.4, 0.02], scale: 0.64 },
        { progress: 0.25, pos: [0.0, 0.6, -0.1], rot: [0.4, 0.55, -0.04], scale: 0.68 },
        { progress: 0.5, pos: [0.0, 0.4, -0.2], rot: [0.18, -0.85, 0.04], scale: 0.62 },
        { progress: 0.75, pos: [0.0, 0.5, 0.1], rot: [0.36, 0.1, 0.0], scale: 0.74 },
        { progress: 1.0, pos: [0.0, 0.4, -0.2], rot: [0.22, 0.75, -0.03], scale: 0.64 },
      ];
    }
    // Desktop waypoints: responsive scrollytelling across screen zones
    return [
      // 0. Hero Section: Right side, facing viewer warmly
      { progress: 0.0, pos: [1.38, -0.15, 0.0], rot: [0.22, -0.48, 0.04], scale: 1.02 },
      // 1. Real-Time Radar & Discovery: Glides to left side, tilted looking in
      { progress: 0.24, pos: [-1.35, 0.1, 0.35], rot: [0.38, 0.68, -0.06], scale: 1.08 },
      // 2. Interactive Map: Sweeps to right side, profile angle
      { progress: 0.48, pos: [1.4, -0.25, 0.1], rot: [0.16, -1.05, 0.08], scale: 0.98 },
      // 3. Seasonal Harvest Guide: Centered close-up inspection
      { progress: 0.72, pos: [0.0, 0.06, 0.75], rot: [0.36, 0.12, 0.0], scale: 1.2 },
      // 4. Sustainable Farm Values & Footer: Warm anchor left side
      { progress: 1.0, pos: [-1.28, -0.18, 0.2], rot: [0.22, 0.85, -0.04], scale: 1.02 },
    ];
  }, [isMobile]);

  useFrame(({ clock, pointer }) => {
    if (!basketGroupRef.current) return;

    // Calculate current window scroll progress (0.0 to 1.0)
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Find the two surrounding waypoints to interpolate between
    let wpA = waypoints[0];
    let wpB = waypoints[waypoints.length - 1];

    for (let i = 0; i < waypoints.length - 1; i++) {
      if (progress >= waypoints[i].progress && progress <= waypoints[i + 1].progress) {
        wpA = waypoints[i];
        wpB = waypoints[i + 1];
        break;
      }
    }

    const range = wpB.progress - wpA.progress || 1;
    const segmentAlpha = (progress - wpA.progress) / range;
    // Smooth cosine ease for organic transition
    const easedAlpha = (1 - Math.cos(segmentAlpha * Math.PI)) / 2;

    // Interpolate target transform values
    const targetX = THREE.MathUtils.lerp(wpA.pos[0], wpB.pos[0], easedAlpha);
    const targetY = THREE.MathUtils.lerp(wpA.pos[1], wpB.pos[1], easedAlpha);
    const targetZ = THREE.MathUtils.lerp(wpA.pos[2], wpB.pos[2], easedAlpha);

    const targetRotX = THREE.MathUtils.lerp(wpA.rot[0], wpB.rot[0], easedAlpha);
    let targetRotY = THREE.MathUtils.lerp(wpA.rot[1], wpB.rot[1], easedAlpha);
    const targetRotZ = THREE.MathUtils.lerp(wpA.rot[2], wpB.rot[2], easedAlpha);

    const targetScale = THREE.MathUtils.lerp(wpA.scale, wpB.scale, easedAlpha);

    // Add continuous gentle ambient breathing/floating motion
    const t = clock.getElapsedTime();
    const floatY = Math.sin(t * 1.25) * 0.06;
    const floatPitch = Math.sin(t * 0.8) * 0.025;
    const floatRoll = Math.cos(t * 0.9) * 0.02;

    // Optional subtle auto-spin drift or pointer parallax
    if (isAutoSpin) {
      targetRotY += t * 0.25;
    } else {
      targetRotY += pointer.x * 0.18;
    }

    const parallaxX = -pointer.y * 0.1;

    // Smoothly damp towards target transforms (lerp with 0.06 factor)
    const current = basketGroupRef.current;
    current.position.x = THREE.MathUtils.lerp(current.position.x, targetX, 0.06);
    current.position.y = THREE.MathUtils.lerp(current.position.y, targetY + floatY, 0.06);
    current.position.z = THREE.MathUtils.lerp(current.position.z, targetZ, 0.06);

    current.rotation.x = THREE.MathUtils.lerp(current.rotation.x, targetRotX + floatPitch + parallaxX, 0.06);
    current.rotation.y = THREE.MathUtils.lerp(current.rotation.y, targetRotY, 0.06);
    current.rotation.z = THREE.MathUtils.lerp(current.rotation.z, targetRotZ + floatRoll, 0.06);

    const scale = THREE.MathUtils.lerp(current.scale.x, targetScale, 0.06);
    current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={basketGroupRef} position={waypoints[0].pos} rotation={waypoints[0].rot}>
      {/* 3D Realistic Produce Basket */}
      <HarvestBasket3D
        onHoverProduce={onHoverProduce}
        activeProduce={activeProduce}
      />

      {/* Glowing Ground Marker Platform */}
      <GlowingGroundMarker position={[0, -0.6, 0]} />

      {/* Soft Contact Shadow beneath Basket */}
      <ContactShadows
        position={[0, -0.65, 0]}
        opacity={0.5}
        scale={5.5}
        blur={2.4}
        far={3.8}
        color="#1b4332"
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Root Scroll3DBackground Component
// ---------------------------------------------------------------------------
export default function Scroll3DBackground({ isEnabled = true }) {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [activeProduce, setActiveProduce] = useState(null);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [scrollMilestone, setScrollMilestone] = useState('01. Morning Harvest');
  const [scrollPercent, setScrollPercent] = useState(0);

  // Monitor scroll for HUD milestones
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const pct = Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100)));
      setScrollPercent(pct);

      if (pct < 18) {
        setScrollMilestone('01. Morning Harvest');
      } else if (pct < 40) {
        setScrollMilestone('02. What’s Fresh Today');
      } else if (pct < 65) {
        setScrollMilestone('03. Market Radar Map');
      } else if (pct < 85) {
        setScrollMilestone('04. Heirloom Harvest');
      } else {
        setScrollMilestone('05. Sustainable Soil');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // WebGL context support check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) setIsWebGLSupported(false);
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  if (!isEnabled || !isWebGLSupported) {
    return null;
  }

  return (
    <>
      {/* Pinned Fixed 3D Canvas Layer */}
      <div
        className="scroll-3d-canvas-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <WebGLErrorBoundary>
          <Canvas
            shadows
            dpr={[1, 1.8]}
            camera={{ position: [0, 0.4, 5.2], fov: 42 }}
            style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              alpha: true,
            }}
          >
            {/* Cinematic Lighting Rig */}
            <ambientLight intensity={1.3} color="#fff8ed" />
            <directionalLight
              position={[5, 8, 4]}
              intensity={2.3}
              color="#fff4e0"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            {/* Fill Lighting */}
            <pointLight position={[-4, 3, -1]} intensity={1.4} color="#74c69d" />
            <pointLight position={[3, -2, 2.5]} intensity={1.2} color="#f4a261" />
            <pointLight position={[0, -3, 0]} intensity={0.8} color="#b7e4c7" />

            {/* Ambient Sunlit Orchard Motes */}
            <Sparkles
              count={40}
              scale={6.5}
              size={2.8}
              speed={0.35}
              color="#d8f3dc"
              opacity={0.7}
            />

            {/* Scroll Choreographed 3D Harvest Basket */}
            <ScrollChoreographer
              onHoverProduce={setActiveProduce}
              activeProduce={activeProduce}
              isAutoSpin={isAutoSpin}
            />

            {/* Post-Processing Bloom for Natural Specular Sheen */}
            <EffectComposer multisampling={0} enableNormalPass={false}>
              <Bloom
                luminanceThreshold={0.55}
                luminanceSmoothing={0.35}
                intensity={1.15}
                mipmapBlur={true}
                radius={0.65}
              />
            </EffectComposer>
          </Canvas>
        </WebGLErrorBoundary>
      </div>

      {/* Floating 3D Scrollytelling HUD Controller */}
      <div
        className="scroll-3d-hud"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 14px',
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(82, 183, 136, 0.28)',
          boxShadow: '0 8px 30px rgba(8, 27, 18, 0.12)',
          fontSize: '0.8125rem',
          color: 'var(--color-forest)',
          pointerEvents: 'auto',
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-leaf-bright)',
            boxShadow: '0 0 10px var(--color-leaf-bright)',
            display: 'inline-block',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '-0.01em' }}>
            {activeProduce ? activeProduce : scrollMilestone}
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            3D Basket · {scrollPercent}% Scrolled
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          <button
            type="button"
            onClick={() => setIsAutoSpin((prev) => !prev)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: isAutoSpin ? 'var(--color-leaf)' : 'rgba(82, 183, 136, 0.12)',
              color: isAutoSpin ? '#ffffff' : 'var(--color-leaf-deep)',
              border: 'none',
              fontSize: '0.6875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Toggle 360° Basket Spin"
          >
            {isAutoSpin ? 'Auto-Spinning' : '360° Spin'}
          </button>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: window.scrollY + window.innerHeight * 0.8,
                behavior: 'smooth',
              });
            }}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              color: 'var(--color-forest)',
              border: '1px solid rgba(82, 183, 136, 0.25)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Scroll Next Milestone"
          >
            ↓ Next
          </button>
        </div>
      </div>
    </>
  );
}
