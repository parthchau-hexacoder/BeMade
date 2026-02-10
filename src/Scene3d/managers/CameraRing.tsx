import * as THREE from 'three'
import { observer } from "mobx-react-lite"
import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { OrbitControls } from '@react-three/drei'
import { useDesign3D } from '../../app/providers/Design3DProvider'



export const CameraRing = observer(()=> {
    
    const design = useDesign3D();
    let manager = design.camera;;

    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    useEffect(() => {

        if (!(camera instanceof THREE.PerspectiveCamera)) return;

        camera.position.set(...manager.position);
        camera.lookAt(...manager.target);
        camera.fov = manager.fov;
        camera.updateProjectionMatrix();
    },[camera, manager.position, manager.target, manager.fov]);

    return(
        <OrbitControls
            ref={controlsRef}
            enabled={manager.enableOrbit}
            minDistance={manager.min}
            maxDistance={manager.max}
            target={manager.target}
            onChange={() => {
                if (!controlsRef.current) return;
                const t = controlsRef.current.target;
                manager.setPosition(camera.position.x, camera.position.y, camera.position.z);
                manager.setTarget(t.x, t.y, t.z);
            }}
        />
    )
})
