"use client";

import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import dynamic from 'next/dynamic';
import styles from '@/components/landingpage/ebook/App.module.css'; // Standardize CSS module import

const Experience = dynamic(() => import('@/components/landingpage/ebook/Experience').then((mod) => mod.Experience), { ssr: false });
const UI = dynamic(() => import('@/components/landingpage/ebook/Ui').then((mod) => mod.UI), { ssr: false });

const App: React.FC = () => {
  const canvasMemo = useMemo(() => (
    <Canvas
      shadows
      camera={{ position: [-0.5, 1, 4], fov: 45 }}
      style={{ height: "100vh", width: "100vw" }}
      onCreated={({ gl }) => {
        gl.setClearColor('white');
      }}
    >
      <group position-y={0}>
        <Suspense fallback={<Loader />}>
          <Experience />
        </Suspense>
      </group>
    </Canvas>
  ), []);

  return (
    <div className={styles.fullScreenContainer}>
      <Suspense fallback={<div>Loading UI...</div>}>
        <UI />
      </Suspense>
      {canvasMemo}
    </div>
  );
};

export default App;
