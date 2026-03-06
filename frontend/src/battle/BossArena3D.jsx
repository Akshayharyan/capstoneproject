import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function BossModel({ attacking }) {

  const bossRef = useRef();
  const { scene } = useGLTF("/models/boss.glb");

  /* CENTER MODEL */

  const box = new THREE.Box3().setFromObject(scene);
  const center = new THREE.Vector3();
  box.getCenter(center);

  scene.position.sub(center);

  useFrame((state) => {

    const t = state.clock.getElapsedTime();

    if (!bossRef.current) return;

    /* idle breathing */

    bossRef.current.position.y =
      Math.sin(t * 2) * 0.05;

    /* slow rotation */

    bossRef.current.rotation.y += 0.002;

    /* attack lunge */

    if (attacking) {
      bossRef.current.position.z =
        Math.sin(t * 10) * 0.3;
    }

  });

  return (
    <primitive
      ref={bossRef}
      object={scene}
      scale={2}
      position={[0, -1, 0]}
    />
  );
}

export default function BossArena3D({ attacking }) {

  return (

    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-700">

      <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>

        {/* ENVIRONMENT LIGHT */}

        <Environment preset="city" />

        {/* LIGHTING */}

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[3, 5, 3]}
          intensity={3}
        />

        <pointLight
          position={[0, 3, 2]}
          intensity={3}
        />

        {/* FLOOR */}

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* BOSS */}

        <BossModel attacking={attacking} />

        {/* CAMERA CONTROL (debug) */}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
        />

      </Canvas>

    </div>

  );
}