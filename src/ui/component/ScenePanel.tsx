import { RefObject } from "react";
import { Scene } from "../../Scene3d/Scene";
import { CameraCarousel } from "./CameraCarousel";
import { SceneActions } from "./SceneActions";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
  isFullscreen: boolean;
  isSceneLoading: boolean;
  onLoadingChange: (isLoading: boolean) => void;
  onInitialLoadComplete: () => void;
  onSave: () => void;
  onToggleFullscreen: () => void;
  actionMessage: string | null;
};

export const ScenePanel = ({
  containerRef,
  isFullscreen,
  isSceneLoading,
  onLoadingChange,
  onInitialLoadComplete,
  onSave,
  onToggleFullscreen,
  actionMessage,
}: Props) => {
  return (
    <div
      ref={containerRef}
      className={`h-[42vh] min-h-65 w-full overflow-hidden relative flex items-center justify-center md:h-full md:w-[70%] ${
        isFullscreen ? "rounded-none" : "rounded-xl md:rounded-2xl"
      }`}
    >
      <Scene
        className="w-full h-full"
        onLoadingChange={onLoadingChange}
        onInitialLoadComplete={onInitialLoadComplete}
      />
      {isSceneLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-gray-300 bg-white/90 shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          </div>
        </div>
      )}
      <SceneActions
        isFullscreen={isFullscreen}
        onSave={onSave}
        onToggleFullscreen={onToggleFullscreen}
        actionMessage={actionMessage}
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center md:bottom-6">
        <CameraCarousel />
      </div>
    </div>
  );
};
