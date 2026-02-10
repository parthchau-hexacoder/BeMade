import { useEffect } from "react";
import GUI from "lil-gui";
import { observer } from "mobx-react-lite";
import { useDesign3D } from "../../app/providers/Design3DProvider";
import { useDesign } from "../../app/providers/DesignProvider";
import type { CameraViewPreset } from "../../design3d/managers/CameraManager";

export const GUIController = observer(() => {
  const { lights } = useDesign3D();
  const { camera } = useDesign3D();
  const { chair } = useDesign();

  useEffect(() => {
    const gui = new GUI({ title: "Lighting Controls" });

    // Preset folder
    const presetFolder = gui.addFolder("Presets");
    presetFolder
      .add({ preset: lights.preset }, "preset", ["studio", "soft", "dramatic"])
      .onChange((value: string) => {
        lights.setPreset(value as "studio" | "soft" | "dramatic");
      });

    // Global lighting folder
    const globalFolder = gui.addFolder("Global");
    globalFolder
      .add(lights, "hemiIntensity", 0, 2, 0.01)
      .name("Hemisphere");
    globalFolder
      .add(lights, "ambientIntensity", 0, 1, 0.01)
      .name("Ambient");

    // Key lights folder
    const keysFolder = gui.addFolder("Key Lights");
    keysFolder
      .add(lights, "topIntensity", 0, 4, 0.1)
      .name("Top Light");
    keysFolder
      .add(lights, "frontFillIntensity", 0, 2, 0.1)
      .name("Front Fill");
    keysFolder
      .add(lights, "backIntensity", 0, 2, 0.1)
      .name("Back Light");

    // Camera views
    const cameraFolder = gui.addFolder("Camera Views");
    const viewOptions = camera.getViewOptions(chair.position.totalChairs > 0);
    const viewController = cameraFolder
      .add({ view: camera.currentView }, "view", viewOptions)
      .name("Preset");

    viewController.onChange((value: CameraViewPreset) => {
      camera.animateToView(value, 1.1);
    });

    // Ensure current view is applied on init
    camera.animateToView(camera.currentView, 1.1);

    cameraFolder
      .add(camera, "enableOrbit")
      .name("Free Orbit");

    // Camera tweak controls
    const tweakFolder = gui.addFolder("Camera Values");
    const position = { x: camera.position[0], y: camera.position[1], z: camera.position[2] };
    const target = { x: camera.target[0], y: camera.target[1], z: camera.target[2] };

    const posX = tweakFolder
      .add(position, "x", -10, 10, 0.01)
      .name("Pos X")
      .onChange(() => camera.setPosition(position.x, position.y, position.z));
    const posY = tweakFolder
      .add(position, "y", -10, 10, 0.01)
      .name("Pos Y")
      .onChange(() => camera.setPosition(position.x, position.y, position.z));
    const posZ = tweakFolder
      .add(position, "z", -10, 10, 0.01)
      .name("Pos Z")
      .onChange(() => camera.setPosition(position.x, position.y, position.z));

    const targetX = tweakFolder
      .add(target, "x", -5, 5, 0.01)
      .name("Target X")
      .onChange(() => camera.setTarget(target.x, target.y, target.z));
    const targetY = tweakFolder
      .add(target, "y", -5, 5, 0.01)
      .name("Target Y")
      .onChange(() => camera.setTarget(target.x, target.y, target.z));
    const targetZ = tweakFolder
      .add(target, "z", -5, 5, 0.01)
      .name("Target Z")
      .onChange(() => camera.setTarget(target.x, target.y, target.z));

    const fovController = tweakFolder
      .add(camera, "fov", 15, 80, 1)
      .name("FOV")
      .onChange((value: number) => camera.setFov(value));

    const refreshCameraValues = () => {
      position.x = camera.position[0];
      position.y = camera.position[1];
      position.z = camera.position[2];
      target.x = camera.target[0];
      target.y = camera.target[1];
      target.z = camera.target[2];
      posX.updateDisplay();
      posY.updateDisplay();
      posZ.updateDisplay();
      targetX.updateDisplay();
      targetY.updateDisplay();
      targetZ.updateDisplay();
      fovController.updateDisplay();
    };

    const interval = window.setInterval(refreshCameraValues, 100);

    return () => {
      window.clearInterval(interval);
      gui.destroy();
    };
  }, [lights, camera, chair.position.totalChairs]);

  return null;
});
