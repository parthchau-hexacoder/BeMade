import { useEffect } from "react";
import { useUI } from "../providers/UIProvider";

export const useAppLifecycle = () => {
  const ui = useUI();

  useEffect(() => {
    const handleFullscreenChange = () => {
      ui.setFullscreen(document.fullscreenElement === ui.sceneContainer);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [ui]);

  useEffect(() => {
    return () => {
      ui.dispose();
    };
  }, [ui]);
};
