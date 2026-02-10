import * as THREE from 'three'
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { Table } from "./objects/table/Table";
import { CameraRing } from "./managers/CameraRing";
import { LightRing } from "./managers/LightRing";
import { ContactShadows, Environment, useProgress } from "@react-three/drei";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { Chairs } from "./objects/chairs/Chair";
import { ChairsPreview } from "./objects/chairs/ChairsPreview";
import { Suspense, useEffect, useState } from "react";
import { useDesign } from "../app/providers/DesignProvider";
import { useDesign3D } from "../app/providers/Design3DProvider";


type Props = {
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onInitialLoadComplete?: () => void;
};

const SceneContents = observer(() => {
  const { table, chair } = useDesign();
  const { camera } = useDesign3D();
  const shadowKey = `${table.top.id}-${table.base.id}-${table.top.length}-${table.top.width}-${chair.id}-${chair.position.totalChairs}-${camera.currentView}`;
  const showChairPreview = camera.currentView === "chair";
  const showChairsAny =
    camera.currentView === "chair" ||
    camera.currentView === "rightTop" ||
    camera.currentView === "topWithChairs";
  const showContactShadows = !showChairPreview;

  return (
    <>
      {!showChairPreview && <Table />}
      {showChairPreview ? <ChairsPreview /> : <Chairs />}
      {showContactShadows && (
        <ContactShadows
          key={shadowKey}
          position={[0, 0, 0]}
          scale={10}
          blur={0.35}
          far={1}
          opacity={0.7}
          frames={1}
        />
      )}

      {!showChairsAny && (
        <EffectComposer multisampling={4} enableNormalPass>
          <SSAO
            radius={0.16}
            intensity={1}
            bias={0.06}
            samples={6}
            luminanceInfluence={0.8}
          />
        </EffectComposer>
      )}

      <LightRing />
      <CameraRing />
      <Environment 
        preset='studio'
        blur={0.25}
        environmentIntensity={0.1}
      />
    </>
  );
});

const LoaderBridge = ({
  onLoadingChange,
  onInitialLoadComplete,
}: {
  onLoadingChange?: (isLoading: boolean) => void;
  onInitialLoadComplete?: () => void;
}) => {
  const { active, loaded, total, progress } = useProgress();
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

  useEffect(() => {
    if (!hasStarted && (active || total > 0 || progress > 0)) {
      setHasStarted(true);
    }
  }, [active, total, progress, hasStarted]);

  const isLoading = !hasStarted
    ? true
    : active || (total > 0 && loaded < total) || (progress > 0 && progress < 100);

  useEffect(() => {
    if (onLoadingChange) onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    if (hasStarted && !isLoading && !hasCompletedOnce) {
      setHasCompletedOnce(true);
      if (onInitialLoadComplete) onInitialLoadComplete();
    }
  }, [hasStarted, isLoading, hasCompletedOnce, onInitialLoadComplete]);

  return null;
};

export const Scene = ({ className, onLoadingChange, onInitialLoadComplete }: Props) => {
  const { camera } = useDesign3D();

  useEffect(() => {
    const updateViewportProfile = () => {
      camera.setIsMobile(window.innerWidth < 768);
    };
    updateViewportProfile();
    window.addEventListener("resize", updateViewportProfile);
    return () => window.removeEventListener("resize", updateViewportProfile);
  }, [camera]);

  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.02,
        outputColorSpace: THREE.SRGBColorSpace
      }}
      className={className}
      camera={{
        position:[0, 1.1, 3.6],
        fov: 45
      }}
      shadows
    >
      <LoaderBridge
        onLoadingChange={(active) => {
          if (onLoadingChange) onLoadingChange(active);
        }}
        onInitialLoadComplete={onInitialLoadComplete}
      />
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
};
