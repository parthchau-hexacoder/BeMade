import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { ContactShadows, useGLTF, useTexture } from "@react-three/drei";
import { setupTexture } from "../../utility/setupTexture";
import { useDesign } from "../../../app/providers/DesignProvider";

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
    });
  }, [
    topTextures.map,
    topTextures.metalnessMap,
    topTextures.roughnessMap,
    topTextures.normalMap,
  ]);

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

  return (
    <>
      {chairs.map((chairItem) => (
        <ChairPreviewItem
          key={chairItem.index}
          item={chairItem}
          scene={scene}
          legMaterial={legMaterial}
          topMaterial={topMaterial}
        />
      ))}
      <ContactShadows
        key={`chair-preview-shadow-${manager.id}-${manager.materialId}`}
        position={[0, 0, 0]}
        scale={3}
        blur={0.55}
        far={1.2}
        opacity={0.6}
        frames={1}
      />
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
