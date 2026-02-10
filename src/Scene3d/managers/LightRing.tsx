import { observer } from "mobx-react-lite";
import { useDesign3D } from "../../app/providers/Design3DProvider";

export const LightRing = observer(() => {
  const { lights } = useDesign3D();
  const manager = lights;

  return (
    <>
      {/* <hemisphereLight
        args={["#ffffff", "#d6d2c8", manager.hemiIntensity]}
      /> */}

      <directionalLight
        position={[-6, 7, 2]}
        intensity={manager.topIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />


      <directionalLight
        position={[3, 0.1, 0]}
        intensity={4}
      />

      <directionalLight
        position={[-3, 0.1, 0]}
        intensity={3}
      />


      <ambientLight intensity={manager.ambientIntensity} />
    </>
  );
});
