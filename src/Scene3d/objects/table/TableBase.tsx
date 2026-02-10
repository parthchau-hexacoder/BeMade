import * as THREE from 'three';
import { observer } from 'mobx-react-lite';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { setupTexture } from '../../utility/setupTexture';
import { useDesign } from '../../../app/providers/DesignProvider';

export const TableBase = observer(() => {

  const { table } = useDesign();
  const manager = table.base;

  const materialFolder = manager.getMaterialFolder();
  const materialName = manager.getMaterialName().toLowerCase();

  const useCradleSmallModel =
    manager.id === 'cradle' && table.top.length <= 2400;

  const modelFile = useCradleSmallModel ? 'smallModel.glb' : 'model.glb';
  const modelPath = `/assets/images/base-shape/${manager.id}/${modelFile}`;

  const { scene } = useGLTF(modelPath);

  const textures = useTexture({
    map: `/assets/images/base-shape/${manager.id}/${materialFolder}/base_color.webp`,
    metalnessMap: `/assets/images/base-shape/${manager.id}/${materialFolder}/metalness.webp`,
    normalMap: `/assets/images/base-shape/${manager.id}/${materialFolder}/normal.webp`,
    roughnessMap: `/assets/images/base-shape/${manager.id}/${materialFolder}/roughness.webp`,
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
   * Material
   */
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textures.map,
      metalnessMap: textures.metalnessMap,
      roughnessMap: textures.roughnessMap,
      normalMap: textures.normalMap,

      color:
        materialName.includes('gold') ||
        materialName.includes('brass')
          ? new THREE.Color('#f5e8d0')
          : new THREE.Color('#ffffff'),

      metalness: 0.35,
      roughness: 0.65,
      envMapIntensity: 2.8,

      normalScale: new THREE.Vector2(0.05, 0.05),

      transparent: false,
      opacity: 1,
      depthWrite: true,
      depthTest: true,
      side: manager.id === 'linea'
        ? THREE.DoubleSide
        : THREE.FrontSide,
    });
  }, [
    textures.map,
    textures.metalnessMap,
    textures.roughnessMap,
    textures.normalMap,
    manager.id,
    materialName,
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
   * Assign material separately
   */
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = true;
      }
    });
  }, [clonedScene, material]);

  /**
   * Default offset from original scene
   */
  const defaultOffset = useMemo(() => {
    if (scene.children.length > 0) {
      return Math.abs(scene.children[0].position.x);
    }
    return 0;
  }, [scene]);

  /**
   * Calculate base parts only when structure changes
   */
  const baseParts = useMemo(() => {
    let left = clonedScene.children[1];
    let right = clonedScene.children[0];

    if (manager.id === 'curva') {
      left = clonedScene.children[0];
      right = clonedScene.children[1];
    }

    if (!left || !right) {
      return {
        left: null as THREE.Object3D | null,
        right: null as THREE.Object3D | null,
        minOffset: 0,
      };
    }

    const leftBox = new THREE.Box3().setFromObject(left);
    const rightBox = new THREE.Box3().setFromObject(right);

    const leftSize = new THREE.Vector3();
    const rightSize = new THREE.Vector3();

    leftBox.getSize(leftSize);
    rightBox.getSize(rightSize);

    const gap = 0.02;
    const minOffset =
      (leftSize.x / 2 + rightSize.x / 2 + gap) / 2;

    return { left, right, minOffset };
  }, [clonedScene, manager.id]);

  /**
   * Update positions when length changes
   */
  useEffect(() => {
    const { left, right, minOffset } = baseParts;
    if (!left || !right) return;

    const scaleFactor = table.top.length / 3180;
    const offset = defaultOffset * scaleFactor;
    const finalOffset = Math.max(offset, minOffset);

    left.position.x = -finalOffset;
    right.position.x = finalOffset;
  }, [table.top.length, defaultOffset, baseParts]);

  return (
    <primitive
      object={clonedScene}
      name={`TableBase-${manager.id}`}
    />
  );
});
