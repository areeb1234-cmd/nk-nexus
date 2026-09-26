import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Realistic Procedural Fruit & Vegetable Harvest Basket
// Handcrafted with realistic organic produce, woven wicker rattan textures,
// and natural specular highlights for cinematic realism.
// ---------------------------------------------------------------------------

// 1. Realistic Honeycrisp Apple
export function Apple({ position = [-0.45, 0.42, 0.35], scale = 1.0, onHover, isHovered }) {
  const meshRef = useRef();

  return (
    <group
      ref={meshRef}
      position={position}
      scale={isHovered ? scale * 1.08 : scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Honeycrisp Apple · Crisp & Orchard Fresh');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Apple Body - Organic dimpled sphere with clearcoat gloss */}
      <mesh castShadow receiveShadow scale={[1.0, 0.94, 0.98]}>
        <sphereGeometry args={[0.38, 24, 20]} />
        <meshStandardMaterial
          color="#d90429"
          emissive="#780016"
          emissiveIntensity={isHovered ? 0.45 : 0.22}
          roughness={0.28}
          metalness={0.06}
        />
      </mesh>

      {/* Apple Stem Cavity Ring (subtle top indentation) */}
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.08, 16]} />
        <meshStandardMaterial color="#582f0e" roughness={0.9} />
      </mesh>

      {/* Apple Curved Wooden Stem */}
      <mesh position={[0.02, 0.45, 0.01]} rotation={[0.15, 0.2, 0.28]} castShadow>
        <cylinderGeometry args={[0.018, 0.026, 0.22, 8]} />
        <meshStandardMaterial color="#43281c" roughness={0.88} />
      </mesh>

      {/* Fresh Apple Leaf */}
      <mesh position={[0.09, 0.46, 0.02]} rotation={[0.4, 0.3, 0.75]} castShadow>
        <coneGeometry args={[0.08, 0.24, 6]} />
        <meshStandardMaterial
          color="#2d6a4f"
          emissive="#1b4332"
          emissiveIntensity={0.25}
          roughness={0.38}
        />
      </mesh>
    </group>
  );
}

// 2. Realistic Valencia Orange
export function Orange({ position = [0.42, 0.36, 0.45], scale = 1.0, onHover, isHovered }) {
  return (
    <group
      position={position}
      scale={isHovered ? scale * 1.08 : scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Valencia Orange · High-Vitamin Citrus');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Orange Body with subtle dimpled peel roughness */}
      <mesh castShadow receiveShadow scale={[1.0, 0.97, 1.0]}>
        <sphereGeometry args={[0.35, 24, 20]} />
        <meshStandardMaterial
          color="#fb8500"
          emissive="#c45800"
          emissiveIntensity={isHovered ? 0.42 : 0.2}
          roughness={0.45}
          metalness={0.04}
        />
      </mesh>

      {/* Calyx Button */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.02, 8]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 3. Realistic Heirloom Carrots (with leafy feather sprigs)
export function Carrot({ position = [0.05, 0.25, 0.65], rotation = [0.35, 0.25, 0.45], scale = 1.0, onHover, isHovered }) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={isHovered ? scale * 1.08 : scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Heirloom Nantes Carrot · Farm Pulled');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Carrot Root Body */}
      <mesh rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.18, 1.25, 18]} />
        <meshStandardMaterial
          color="#f77f00"
          emissive="#b84a00"
          emissiveIntensity={isHovered ? 0.38 : 0.2}
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>

      {/* Segmented Ring Ridges for realism */}
      {[-0.15, -0.35, -0.55, -0.75].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17 - i * 0.032, 0.012, 8, 20]} />
          <meshStandardMaterial color="#e85d04" roughness={0.6} />
        </mesh>
      ))}

      {/* Carrot Top Leafy Greens */}
      <group position={[0, 0.62, 0]}>
        {[-0.08, 0, 0.08].map((offset, idx) => (
          <mesh
            key={idx}
            position={[offset, 0.2, idx === 1 ? 0.04 : -0.02]}
            rotation={[0.15 * (idx - 1), 0, (idx - 1) * 0.3]}
            castShadow
          >
            <coneGeometry args={[0.035, 0.48, 6]} />
            <meshStandardMaterial
              color="#2d6a4f"
              emissive="#194d36"
              emissiveIntensity={0.24}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 4. Realistic Autumn Mini Pumpkin / Kabocha Squash (Segmented 8-lobed body)
export function Pumpkin({ position = [0.65, 0.28, -0.1], scale = 0.95, onHover, isHovered }) {
  const lobes = useMemo(() => {
    const list = [];
    const count = 8;
    const radius = 0.22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle,
      });
    }
    return list;
  }, []);

  return (
    <group
      position={position}
      scale={isHovered ? scale * 1.08 : scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Sugar Pie Pumpkin · Autumn Heirloom');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Central Core */}
      <mesh castShadow receiveShadow scale={[1.15, 0.78, 1.15]}>
        <sphereGeometry args={[0.34, 18, 16]} />
        <meshStandardMaterial
          color="#e76f51"
          emissive="#a64324"
          emissiveIntensity={isHovered ? 0.42 : 0.22}
          roughness={0.48}
        />
      </mesh>

      {/* 8 Radial Lobes creating authentic pumpkin ridges */}
      {lobes.map((lobe, i) => (
        <mesh
          key={i}
          position={[lobe.x, 0, lobe.z]}
          scale={[0.7, 0.74, 0.7]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial
            color="#f4a261"
            emissive="#b84a00"
            emissiveIntensity={isHovered ? 0.35 : 0.18}
            roughness={0.52}
          />
        </mesh>
      ))}

      {/* Rustic Curved Hexagonal Stem */}
      <mesh position={[0, 0.28, 0]} rotation={[0.15, 0.1, 0.25]} castShadow>
        <cylinderGeometry args={[0.038, 0.065, 0.22, 6]} />
        <meshStandardMaterial color="#582f0e" roughness={0.92} />
      </mesh>
    </group>
  );
}

// 5. Cluster of Royal Concord Grapes (Glossy wine-purple spheres draped over basket)
export function GrapeCluster({ position = [-0.75, 0.3, 0.62], onHover, isHovered }) {
  const grapes = useMemo(() => {
    return [
      // Top layer
      [-0.05, 0.12, 0.0],
      [0.06, 0.14, 0.02],
      [-0.02, 0.15, 0.08],
      // Mid layer
      [-0.1, 0.04, 0.06],
      [0.0, 0.05, 0.12],
      [0.1, 0.06, 0.08],
      [-0.04, 0.02, -0.05],
      [0.06, 0.03, -0.04],
      // Draping layer
      [-0.08, -0.06, 0.14],
      [0.02, -0.05, 0.18],
      [0.11, -0.04, 0.14],
      [-0.02, -0.12, 0.19],
      [0.05, -0.11, 0.22],
      // Tip
      [0.01, -0.18, 0.24],
      [-0.02, -0.24, 0.26],
    ];
  }, []);

  return (
    <group
      position={position}
      scale={isHovered ? 1.08 : 1.0}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Concord Grapes · Sun-Drenched & Sweet');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Wooden Vine Stalk */}
      <mesh position={[0, 0.16, 0.04]} rotation={[0.2, 0, 0.4]}>
        <cylinderGeometry args={[0.015, 0.022, 0.22, 6]} />
        <meshStandardMaterial color="#4a2810" roughness={0.9} />
      </mesh>

      {/* Individual Plump Grapes with Glossy Translucent Sheen */}
      {grapes.map((gPos, idx) => (
        <mesh key={idx} position={gPos} castShadow receiveShadow>
          <sphereGeometry args={[0.075, 14, 12]} />
          <meshStandardMaterial
            color="#5a189a"
            emissive="#3c096c"
            emissiveIntensity={isHovered ? 0.5 : 0.28}
            roughness={0.24}
            metalness={0.12}
          />
        </mesh>
      ))}
    </group>
  );
}

// 6. Ripe Cavendish Bananas Bunch
export function BananaBunch({ position = [-0.15, 0.38, -0.3], rotation = [0.4, -0.6, 0.3], onHover, isHovered }) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={isHovered ? 1.08 : 1.0}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Cavendish Bananas · Organically Grown');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Crown Peduncle */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.045, 0.055, 0.12, 8]} />
        <meshStandardMaterial color="#4a2810" roughness={0.88} />
      </mesh>

      {/* 3 Curved Bananas */}
      {[-0.09, 0, 0.09].map((offset, i) => (
        <group key={i} position={[offset, 0, (i - 1) * 0.05]} rotation={[0.1 * i, 0, 0.15 * (i - 1)]}>
          <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.052, 0.058, 0.58, 7]} />
            <meshStandardMaterial
              color="#ffb703"
              emissive="#c48a00"
              emissiveIntensity={isHovered ? 0.35 : 0.18}
              roughness={0.36}
            />
          </mesh>
          {/* Green Tip */}
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.048, 0.12, 7]} />
            <meshStandardMaterial color="#55a630" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 7. Vine-Ripened Heirloom Tomato
export function Tomato({ position = [0.15, 0.34, 0.25], scale = 0.88, onHover, isHovered }) {
  return (
    <group
      position={position}
      scale={isHovered ? scale * 1.08 : scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Early Girl Tomato · Vine Ripened');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Squat Plump Tomato Body */}
      <mesh castShadow receiveShadow scale={[1.08, 0.86, 1.08]}>
        <sphereGeometry args={[0.26, 20, 18]} />
        <meshStandardMaterial
          color="#d62828"
          emissive="#780016"
          emissiveIntensity={isHovered ? 0.42 : 0.22}
          roughness={0.22}
          metalness={0.06}
        />
      </mesh>

      {/* 5-star Green Calyx Leaves on top */}
      <group position={[0, 0.22, 0]}>
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <mesh key={i} rotation={[0, (deg * Math.PI) / 180, 0.4]}>
            <coneGeometry args={[0.03, 0.12, 4]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 8. Handcrafted Woven Rattan / Wicker Harvest Basket
export function WickerBasket({ onHover, isHovered }) {
  // Ribbed concentric rings of the woven wicker bowl
  const wickerRings = useMemo(() => {
    return [
      { y: -0.45, radius: 1.05, tube: 0.055 },
      { y: -0.3, radius: 1.22, tube: 0.058 },
      { y: -0.15, radius: 1.38, tube: 0.062 },
      { y: 0.0, radius: 1.52, tube: 0.065 },
      { y: 0.15, radius: 1.62, tube: 0.068 },
    ];
  }, []);

  // Vertical woven wicker ribs
  const verticalRibs = useMemo(() => {
    const list = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      list.push(angle);
    }
    return list;
  }, []);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover && onHover('Handwoven Wicker Basket · Natural Rattan');
      }}
      onPointerOut={() => onHover && onHover(null)}
    >
      {/* Basket Solid Inner Hull (prevents empty see-through gaps) */}
      <mesh position={[0, -0.18, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.6, 1.02, 0.65, 32, 1, true]} />
        <meshStandardMaterial
          color="#7f4f24"
          roughness={0.88}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Basket Solid Wooden Base Plinth */}
      <mesh position={[0, -0.48, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.05, 1.0, 0.08, 32]} />
        <meshStandardMaterial color="#582f0e" roughness={0.9} />
      </mesh>

      {/* Bed of Organic Salad Lettuce / Cabbage Cushioning the Fruits */}
      <mesh position={[0, 0.02, 0]} scale={[1.45, 0.32, 1.45]}>
        <sphereGeometry args={[0.95, 20, 16]} />
        <meshStandardMaterial
          color="#40916c"
          emissive="#1b4332"
          emissiveIntensity={0.2}
          roughness={0.65}
        />
      </mesh>

      {/* Concentric Horizontal Wicker Rattan Weave Rings */}
      {wickerRings.map((ring, i) => (
        <mesh key={i} position={[0, ring.y, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[ring.radius, ring.tube, 12, 36]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#936639" : "#7f4f24"}
            roughness={0.85}
            metalness={0.03}
          />
        </mesh>
      ))}

      {/* Vertical Wicker Rattan Ribs */}
      {verticalRibs.map((angle, i) => {
        const xTop = Math.cos(angle) * 1.62;
        const zTop = Math.sin(angle) * 1.62;
        const xBot = Math.cos(angle) * 1.05;
        const zBot = Math.sin(angle) * 1.05;
        const midX = (xTop + xBot) / 2;
        const midZ = (zTop + zBot) / 2;

        return (
          <mesh
            key={i}
            position={[midX, -0.15, midZ]}
            rotation={[0, -angle, 0.42]}
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, 0.72, 6]} />
            <meshStandardMaterial color="#582f0e" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Heavy Braided Basket Rim (Main Top Torus) */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.64, 0.085, 14, 48]} />
        <meshStandardMaterial
          color="#b07d62"
          roughness={0.82}
          metalness={0.04}
        />
      </mesh>

      {/* Arched Braided Rattan Handle Left */}
      <mesh position={[-1.62, 0.52, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.38, 0.05, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#7f4f24" roughness={0.88} />
      </mesh>

      {/* Arched Braided Rattan Handle Right */}
      <mesh position={[1.62, 0.52, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.38, 0.05, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#7f4f24" roughness={0.88} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Master Harvest Basket Assembly
// ---------------------------------------------------------------------------
export default function HarvestBasket3D({ onHoverProduce, activeProduce }) {
  const basketRef = useRef();

  return (
    <group ref={basketRef}>
      {/* 1. Handcrafted Woven Wicker Basket */}
      <WickerBasket
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Basket')}
      />

      {/* 2. Realistic Honeycrisp Apple */}
      <Apple
        position={[-0.45, 0.4, 0.35]}
        scale={1.05}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Apple')}
      />

      {/* 3. Second Orchard Green/Blush Apple */}
      <Apple
        position={[-0.2, 0.36, -0.42]}
        scale={0.92}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Apple')}
      />

      {/* 4. Valencia Sun Orange */}
      <Orange
        position={[0.45, 0.36, 0.42]}
        scale={1.02}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Orange')}
      />

      {/* 5. Heirloom Nantes Carrots (Pair nestled together) */}
      <Carrot
        position={[0.08, 0.28, 0.7]}
        rotation={[0.35, 0.2, 0.4]}
        scale={1.0}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Carrot')}
      />
      <Carrot
        position={[-0.22, 0.22, 0.65]}
        rotation={[0.38, -0.3, -0.32]}
        scale={0.88}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Carrot')}
      />

      {/* 6. Autumn Mini Pumpkin / Squash */}
      <Pumpkin
        position={[0.62, 0.28, -0.1]}
        scale={0.95}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Pumpkin')}
      />

      {/* 7. Cluster of Royal Concord Grapes */}
      <GrapeCluster
        position={[-0.88, 0.28, 0.62]}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Grapes')}
      />

      {/* 8. Cavendish Bananas Bunch */}
      <BananaBunch
        position={[-0.05, 0.4, -0.3]}
        rotation={[0.35, -0.5, 0.25]}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Banana')}
      />

      {/* 9. Vine-Ripened Tomato */}
      <Tomato
        position={[0.12, 0.32, 0.22]}
        scale={0.88}
        onHover={onHoverProduce}
        isHovered={activeProduce?.includes('Tomato')}
      />
    </group>
  );
}
