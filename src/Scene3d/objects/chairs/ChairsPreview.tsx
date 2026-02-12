import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { setupTexture } from "../../utility/setupTexture";
import { useDesign } from "../../../app/providers/DesignProvider";
import { gsap } from "gsap";

export const ChairsPreview = observer(() => {

  const { chair } = useDesign();
  const manager = chair;

  const modelPath = `/assets/images/accessories/${manager.id}/model.glb`;
  const { scene } = useGLTF(modelPath);

  /**
   * Textures
   */
  const legTexture = useTexture({
    map: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairLegColor.webp`,
    metalnessMap: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairLegMetalness.webp`,
    normalMap: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairLegNormal.webp`,
    roughnessMap: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairLegRoughness.webp`,
  });

  const topTextures = useTexture({
    map: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairTopColor.webp`,
    metalnessMap: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairTopMetalness.webp`,
    normalMap: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairTopNormal.webp`,
    roughnessMap: `/assets/images/accessories/${manager.id}/${manager.materialId}/chairTopRoughness.webp`,
  });

  /**
   * Texture setup
   */
  useEffect(() => {
    const setup = (t: any) => {
      if (!t?.map) return;

      setupTexture(t.map, { colorSpace: THREE.SRGBColorSpace });
      setupTexture(t.metalnessMap);
      setupTexture(t.roughnessMap);
      setupTexture(t.normalMap);

      t.map.anisotropy = 16;
      t.map.needsUpdate = true;
    };

    setup(legTexture);
    setup(topTextures);

  }, [
    legTexture.map,
    legTexture.metalnessMap,
    legTexture.roughnessMap,
    legTexture.normalMap,
    topTextures.map,
    topTextures.metalnessMap,
    topTextures.roughnessMap,
    topTextures.normalMap,
  ]);

  /**
   * Materials
   */
  const legMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: legTexture.map,
      metalnessMap: legTexture.metalnessMap,
      roughnessMap: legTexture.roughnessMap,
      normalMap: legTexture.normalMap,
      metalness: 0.3,
      roughness: 0.3,
    });
  }, [
    legTexture.map,
    legTexture.metalnessMap,
    legTexture.roughnessMap,
    legTexture.normalMap,
  ]);

  const topMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: topTextures.map,
      metalnessMap: topTextures.metalnessMap,
      roughnessMap: topTextures.roughnessMap,
      normalMap: topTextures.normalMap,
      transparent: true,
      opacity: 0,
    });
  }, [
    topTextures.map,
    topTextures.metalnessMap,
    topTextures.roughnessMap,
    topTextures.normalMap,
  ]);

  useEffect(() => {
    topMaterial.opacity = 0;
    const tween = gsap.to(topMaterial, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
    };
  }, [topMaterial]);

  useEffect(() => {
    return () => {
      legMaterial.dispose();
      topMaterial.dispose();
    };
  }, [legMaterial, topMaterial]);

  /**
   * Static preview transforms
   */
  const chairs = useMemo(() => [
    {
      index: 0,
      position: [-0.35, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
    {
      index: 1,
      position: [0.35, 0, 0] as [number, number, number],
      rotation: [0, -Math.PI, 0] as [number, number, number],
    },
  ], []);

  const shadowTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size * 0.5
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.35)");
    gradient.addColorStop(0.45, "rgba(0,0,0,0.16)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      shadowTexture?.dispose();
    };
  }, [shadowTexture]);

  return (
    <>
      {chairs.map((chairItem) => (
        <group key={chairItem.index}>
          <ChairPreviewItem
            item={chairItem}
            scene={scene}
            legMaterial={legMaterial}
            topMaterial={topMaterial}
          />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[chairItem.position[0], 0.002, chairItem.position[2]]}
          >
            <planeGeometry args={[0.95, 0.62]} />
            <meshBasicMaterial
              map={shadowTexture ?? undefined}
              transparent
              opacity={0.65}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
});

const ChairPreviewItem = ({
  item,
  scene,
  legMaterial,
  topMaterial,
}: {
  item: {
    index: number;
    position: [number, number, number];
    rotation: [number, number, number];
  };
  scene: THREE.Group;
  legMaterial: THREE.Material;
  topMaterial: THREE.Material;
}) => {
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.material = mesh.name === "Leg" ? legMaterial : topMaterial;
      }
    });
  }, [clonedScene, legMaterial, topMaterial]);

  return (
    <group
      name={`ChairPreview-${item.index}`}
      position={item.position}
      rotation={item.rotation}
    >
      <primitive object={clonedScene} />
    </group>
  );
};
