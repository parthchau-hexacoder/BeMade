import * as THREE from 'three'
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { Table } from "./objects/table/Table";
import { CameraRing } from "./managers/CameraRing";
import { LightRing } from "./managers/LightRing";
import { ContactShadows, Environment, useProgress } from "@react-three/drei";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { Chairs } from "./objects/chairs/Chair";
import { ChairsPreview } from "./objects/chairs/ChairsPreview";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDesign } from "../app/providers/DesignProvider";
import { useDesign3D } from "../app/providers/Design3DProvider";


type Props = {
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onInitialLoadComplete?: () => void;
};
const MIN_TRANSITION_LOADER_MS = 220;

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
      <group visible={!showChairPreview}>
        <Table />
        <Chairs />
      </group>
      <group visible={showChairPreview}>
        <ChairsPreview />
      </group>
      {showContactShadows && (
        <>
        <ContactShadows
          key={shadowKey}
          position={[0, 0, 0]}
          scale={10}
          blur={0.35}
          far={1}
          opacity={0.7}
          frames={1}
        />

        <ContactShadows
            key={`${shadowKey}-base`}
            position={[0, 0, 0]}
            scale={6}
            blur={0.8}
            far={0.5}
            opacity={0.45}
            frames={1}
          />
        </>
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

const ClearFrameBuffer = () => {
  useFrame(({ gl }) => {
    gl.clear(true, true, true);
  }, -1);

  return null;
};

const hasSceneTexturesReady = (root: THREE.Object3D) => {
  let hasAnyTexture = false;
  let allTexturesReady = true;

  const hasCompleteFlag = (value: unknown): value is { complete: boolean; naturalWidth?: number } => {
    return typeof value === "object" && value !== null && "complete" in value;
  };

  const isTextureReady = (texture: THREE.Texture) => {
    const sourceData = texture.source?.data;

    if (!sourceData) return false;
    if (Array.isArray(sourceData)) {
      return sourceData.every((entry) => {
        if (!entry) return false;
        if (hasCompleteFlag(entry)) {
          const naturalWidth = entry.naturalWidth ?? 1;
          return entry.complete && naturalWidth > 0;
        }
        return true;
      });
    }
    if (hasCompleteFlag(sourceData)) {
      const naturalWidth = sourceData.naturalWidth ?? 1;
      return sourceData.complete && naturalWidth > 0;
    }

    return true;
  };

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      const materialRecord = material as unknown as Record<string, unknown>;
      for (const value of Object.values(materialRecord)) {
        if (value instanceof THREE.Texture) {
          hasAnyTexture = true;
          if (!isTextureReady(value)) {
            allTexturesReady = false;
            return;
          }
        }
      }
      if (!allTexturesReady) return;
    }
  });

  return hasAnyTexture && allTexturesReady;
};

const LoaderBridge = ({
  cycleKey,
  onLoadingChange,
  onInitialLoadComplete,
}: {
  cycleKey: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onInitialLoadComplete?: () => void;
}) => {
  const scene = useThree((state) => state.scene);
  const { active: isAssetLoading } = useProgress();
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);
  const [isVisualReadyForCycle, setIsVisualReadyForCycle] = useState(false);
  const currentCycleKeyRef = useRef(cycleKey);
  const visualReadyFramesRef = useRef(0);
  const cycleStartedAtRef = useRef(performance.now());

  useEffect(() => {
    if (currentCycleKeyRef.current !== cycleKey) {
      currentCycleKeyRef.current = cycleKey;
      visualReadyFramesRef.current = 0;
      cycleStartedAtRef.current = performance.now();
      setIsVisualReadyForCycle(false);
    }
  }, [cycleKey]);

  const isLoading = isAssetLoading || !isVisualReadyForCycle;

  useFrame(() => {
    if (isVisualReadyForCycle) {
      visualReadyFramesRef.current = 0;
      return;
    }

    if (isAssetLoading) {
      visualReadyFramesRef.current = 0;
      return;
    }

    const elapsed = performance.now() - cycleStartedAtRef.current;
    const minDurationReached = elapsed >= MIN_TRANSITION_LOADER_MS;
    const texturesReady = hasSceneTexturesReady(scene);
    const canFinishCycle = texturesReady && minDurationReached;

    if (canFinishCycle) {
      visualReadyFramesRef.current += 1;
      if (visualReadyFramesRef.current >= 2) {
        setIsVisualReadyForCycle(true);
      }
      return;
    }

    visualReadyFramesRef.current = 0;
  });

  useEffect(() => {
    if (onLoadingChange) onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    if (!isLoading && !hasCompletedOnce) {
      setHasCompletedOnce(true);
      if (onInitialLoadComplete) onInitialLoadComplete();
    }
  }, [isLoading, hasCompletedOnce, onInitialLoadComplete]);

  return null;
};

export const Scene = observer(({ className, onLoadingChange, onInitialLoadComplete }: Props) => {
  const { table, chair } = useDesign();
  const { camera } = useDesign3D();
  const cradleModelVariant = table.base.id === "cradle" && table.top.length <= 2400 ? "small" : "regular";
  const loadingCycleKey = `${table.top.id}|${table.top.materialId}|${table.base.id}|${table.base.materialId}|${chair.id}|${chair.materialId}|${cradleModelVariant}`;

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
        preserveDrawingBuffer: true,
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
        cycleKey={loadingCycleKey}
        onLoadingChange={(active) => {
          if (onLoadingChange) onLoadingChange(active);
        }}
        onInitialLoadComplete={onInitialLoadComplete}
      />
      <ClearFrameBuffer />
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
});
