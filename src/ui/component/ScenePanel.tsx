import { observer } from "mobx-react-lite";
import { useAppActions } from "../../app/hooks/useAppActions";
import { Scene } from "../../Scene3d/Scene";
import { CameraCarousel } from "./CameraCarousel";
import { SceneActions } from "./SceneActions";
import { TopMaterialInfo } from "./TopMaterialInfo";
import { SquareLoader } from "./loaders/SquareLoader";

export const ScenePanel = observer(() => {
  const { ui, registerSceneContainer, onSceneInitialLoadComplete } = useAppActions();

  return (
    <div
      ref={registerSceneContainer}
      className={`scene-panel-layout h-[42vh] min-h-65 w-full overflow-hidden relative flex items-center justify-center md:h-full md:w-[65%] ${
        ui.isFullscreen ? "rounded-none" : "rounded-xl md:rounded-2xl"
      }`}
    >
      <Scene
        className="w-full h-full"
        onLoadingChange={ui.setSceneLoading}
        onInitialLoadComplete={onSceneInitialLoadComplete}
      />
      {ui.isSceneLoading && ui.hasSceneReady && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SquareLoader />
        </div>
      )}
      <SceneActions />
      <TopMaterialInfo />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center md:bottom-6">
        <CameraCarousel />
      </div>
    </div>
  );
});
