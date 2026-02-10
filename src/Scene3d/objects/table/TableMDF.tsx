import * as THREE from 'three';
import { observer } from 'mobx-react-lite';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { applyTextureCut } from '../../utility/applyTextureCut';
import { setupTexture } from '../../utility/setupTexture';
import { useDesign } from '../../../app/providers/DesignProvider';

export const TableMDF = observer(() => {

  const { table } = useDesign();
  const manager = table.top;

  const modelPath = `/assets/images/top-shape/${manager.id}/model-mdf.glb`;
  const { scene } = useGLTF(modelPath);

  const textures = useTexture({
    map: `/assets/images/top-color/${manager.materialId}/mdf_color.webp`,
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
  }, [
    textures.map,
    textures.metalnessMap,
    textures.roughnessMap,
    textures.normalMap,
  ]);

  const textureRepeat = useMemo(() => {
    const maxLength = manager.getMaxLength();
    const maxWidth = manager.getMaxWidth();
    const x = Math.min(1, manager.length / maxLength);
    const z = Math.min(1, manager.width / maxWidth);
    if( table.top.id === 'round' || table.top.id === 'square') return [ x, x ] as [number, number];
    return [x, z] as [number, number];
  }, [manager.length, manager.width, manager.id]);

  const findCenter = useMemo(() => {
    if( table.top.id === 'round' || table.top.id === 'square') return [ -0.3, 0.3 ] as [number, number];
    return [0, 0.3] as [number, number];
  }, [manager.length, manager.width, manager.id]);

  useEffect(() => {
    applyTextureCut(textures.map, textureRepeat, findCenter);
    applyTextureCut(textures.metalnessMap, textureRepeat, findCenter);
    applyTextureCut(textures.roughnessMap, textureRepeat, findCenter);
    applyTextureCut(textures.normalMap, textureRepeat, findCenter);
  }, [
    textureRepeat,
    textures.map,
    textures.metalnessMap,
    textures.roughnessMap,
    textures.normalMap,
  ]);

  /**
   * Material
   */
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textures.map,
      metalnessMap: textures.metalnessMap,
      roughnessMap: textures.roughnessMap,
      normalMap: textures.normalMap,
      metalness: 0.8,
      roughness: 0.5,
    });
  }, [
    textures.map,
    textures.metalnessMap,
    textures.roughnessMap,
    textures.normalMap,
  ]);

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

  return (
    <primitive
      object={clonedScene}
      scale={scale}
    />
  );
});
