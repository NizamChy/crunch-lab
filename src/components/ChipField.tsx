"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Procedural ridged potato chip: an elliptical disc, saddle-curved, with ridges. */
function useChipGeometry(lite: boolean) {
  return useMemo(() => {
    const g = lite ? new THREE.RingGeometry(0.001, 1, 48, 14) : new THREE.RingGeometry(0.001, 1, 96, 28);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.y, v.x);
      const r = Math.hypot(v.x, v.y);
      const wobble = 1 + 0.07 * Math.sin(a * 3 + 1.3) + 0.04 * Math.sin(a * 7);
      const x = v.x * wobble * 1.1;
      const y = v.y * wobble * 0.85;
      const z = 0.19 * (x * x - y * y) + 0.035 * Math.sin(x * 18) * Math.min(1, r * 1.4) - 0.15 * r * r;
      pos.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    return g;
  }, [lite]);
}

type ChipData = { pos: THREE.Vector3; rot: THREE.Euler; spin: THREE.Vector3; speed: number; scale: number };

function makeChips(count: number): ChipData[] {
  const list = Array.from({ length: count }, (_, i) => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12, -Math.random() * 14 + 2),
    rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    spin: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
    speed: 0.4 + Math.random() * 0.9,
    scale: i === 0 ? 2.1 : 0.45 + Math.random() * 0.75,
  }));
  list[0].pos.set(0.4, 0, 1.5);
  return list;
}

function Chips({ count = 46, lite = false }: { count?: number; lite?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useChipGeometry(lite);
  const { viewport, pointer } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => makeChips(count), [count]);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    data.forEach((c, i) => {
      if (i === 0) {
        c.rot.x = 0.5 + Math.sin(t * 0.6) * 0.3 + pointer.y * 0.4;
        c.rot.y = Math.sin(t * 0.4) * 0.5 + pointer.x * 0.6;
        c.rot.z = -0.6 + Math.sin(t * 0.3) * 0.15;
        c.pos.y = Math.sin(t * 0.9) * 0.2;
      } else {
        c.pos.y -= dt * c.speed;
        c.rot.x += c.spin.x * dt;
        c.rot.y += c.spin.y * dt;
        c.rot.z += c.spin.z * dt;
        if (c.pos.y < -8) {
          c.pos.y = 8;
          c.pos.x = (Math.random() - 0.5) * 16;
        }
      }
      dummy.position.copy(c.pos);
      dummy.position.x += pointer.x * (i === 0 ? 0.3 : 0.6) * (c.pos.z + 14) * 0.08;
      dummy.rotation.copy(c.rot);
      dummy.scale.setScalar(c.scale * Math.min(1.2, viewport.width / 10));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshStandardMaterial color="#f3c96b" roughness={0.55} metalness={0.05} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export default function ChipField({ fogColor = "#a3124a", count }: { fogColor?: string; count?: number }) {
  // client-only (loaded with ssr: false). Phones: fewer, lower-poly chips at a capped pixel ratio.
  const [lite] = useState(() => window.matchMedia("(max-width: 767px), (pointer: coarse)").matches);
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={lite ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={[fogColor, 6, 20]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#fff3d6", "#7a0b33", 0.9]} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#fff2c4" />
      <directionalLight position={[-6, -2, 2]} intensity={0.8} color="#ff7aa8" />
      <Chips count={count ?? (lite ? 22 : 46)} lite={lite} />
    </Canvas>
  );
}
