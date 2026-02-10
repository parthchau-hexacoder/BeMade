import * as THREE from 'three';
import { observer } from 'mobx-react-lite';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { setupTexture } from '../../utility/setupTexture';
import { useDesign } from '../../../app/providers/DesignProvider';

export const TableTop = observer(() => {

  const { table } = useDesign();
  const manager = table.top;

  const modelPath = `/assets/images/top-shape/${manager.id}/model.glb`;

  const { scene } = useGLTF(modelPath);

  const textures = useTexture({
    map: `/assets/images/top-color/${manager.materialId}/base_color.webp`,
    metalnessMap: `/assets/images/top-color/${manager.materialId}/metalness.webp`,
    normalMap: `/assets/images/top-color/${manager.materialId}/normal.webp`,
    roughnessMap: `/assets/images/top-color/${manager.materialId}/roughness.webp`,
  });

  /**
   * Texture setup (single pass)
   */
  useEffect(() => {
    if (!textures.map) return;

    setupTexture(textures.map, {
      colorSpace: THREE.SRGBColorSpace,
    });

    setupTexture(textures.metalnessMap);
    setupTexture(textures.roughnessMap);
    setupTexture(textures.normalMap);

    textures.map.anisotropy = 16;
    textures.map.needsUpdate = true;
  }, [
    textures.map,
    textures.metalnessMap,
    textures.roughnessMap,
    textures.normalMap,
  ]);

  /**
   * Material creation
   */
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textures.map,
      metalnessMap: textures.metalnessMap,
      roughnessMap: textures.roughnessMap,
      normalMap: textures.normalMap,
      metalness: 0.0,
      roughness: 0.6,
      envMapIntensity: 0.7,
    });
  }, [
    textures.map,
    textures.metalnessMap,
    textures.roughnessMap,
    textures.normalMap,
  ]);

  /**
   * Dispose material on change
   */
  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  /**
   * Clone scene ONLY when model changes
   */
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  /**
   * Assign material without re-cloning
   */
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clonedScene, material]);

  /**
   * Scale calculation (optimized)
   */
  const scale = useMemo(() => {
    let x = manager.length / 3180;
    let z = manager.width / 1300;

    if (manager.length === manager.width) {
      x = z;
    }

    return [x, 1, z] as [number, number, number];
  }, [manager.length, manager.width]);

  return <primitive object={clonedScene} scale={scale} />;
});
