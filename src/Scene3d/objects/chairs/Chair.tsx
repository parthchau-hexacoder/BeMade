import * as THREE from 'three';
import { observer } from "mobx-react-lite";
import { useGLTF, useTexture } from "@react-three/drei";
import { setupTexture } from "../../utility/setupTexture";
import { useEffect, useMemo } from "react";
import { useDesign } from '../../../app/providers/DesignProvider';
import { useDesign3D } from '../../../app/providers/Design3DProvider';

export const Chairs = observer(() => {

    const { chair } = useDesign();
    const { camera } = useDesign3D();
    const manager = chair;

    const showChairs =
        camera.currentView === "rightTop" ||
        camera.currentView === "topWithChairs";

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
     * Chair transforms
     */
    const chairs = manager.position.chairTransforms;

    if (!showChairs) return null;

    return (
        <>
            {chairs.map((chairData) => (
                <ChairItem
                    key={chairData.index}
                    item={chairData}
                    scene={scene}
                    legMaterial={legMaterial}
                    topMaterial={topMaterial}
                />
            ))}
        </>
    );
});

const ChairItem = ({
    item,
    scene,
    legMaterial,
    topMaterial,
}: {
    item: any;
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
                // mesh.receiveShadow = true;
                mesh.material = mesh.name === "Leg" ? legMaterial : topMaterial;
            }
        });
    }, [clonedScene, legMaterial, topMaterial]);

    return (
        <group
            name={`Chair-${item.index}`}
            position={item.position}
            rotation={item.rotation}
        >
            <primitive object={clonedScene} />
        </group>
    );
};
