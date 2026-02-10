import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDesign } from "../providers/DesignProvider";
import { useUI } from "../providers/UIProvider";

export const useAppActions = () => {
  const ui = useUI();
  const design = useDesign();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignRoute = location.pathname === "/";

  const onNavClick = useCallback(
    (id: string) => {
      ui.setActiveNavId(id);

      if (!isDesignRoute) {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 0);
        return;
      }

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isDesignRoute, navigate, ui]
  );

  const onPlaceOrder = useCallback(async () => {

    const canvas = ui.sceneContainer?.querySelector("canvas");

    if (canvas) {
      try {
        design.setCheckoutPreviewImage(canvas.toDataURL("image/png"));
      } catch {
        design.setCheckoutPreviewImage(null);
      }
    } else {
      design.setCheckoutPreviewImage(null);
    }

    navigate("/checkout");
  }, [design, navigate, ui]);

  const onBackToDesign = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onSave = useCallback(() => {
    const payload = {
      table: {
        top: {
          id: design.table.top.id,
          length: design.table.top.length,
          width: design.table.top.width,
          materialId: design.table.top.materialId,
        },
        base: {
          id: design.table.base.id,
          materialId: design.table.base.materialId,
        },
      },
      chair: {
        id: design.chair.id,
        materialId: design.chair.materialId,
        totalChairs: design.chair.position.totalChairs,
      },
      samples: design.samples,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("be-made-design", JSON.stringify(payload));
    ui.showActionMessage("Saved locally");
  }, [design, ui]);

  const onToggleFullscreen = useCallback(async () => {
    const container = ui.sceneContainer;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else {
        ui.showActionMessage("Fullscreen not supported");
      }
    } catch {
      ui.showActionMessage("Fullscreen failed");
    }
  }, [ui]);

  const registerSceneContainer = useCallback(
    (el: HTMLDivElement | null) => {
      ui.setSceneContainer(el);
    },
    [ui]
  );

  const onSceneInitialLoadComplete = useCallback(() => {
    ui.markSceneReady();
  }, [ui]);

  return {
    ui,
    onNavClick,
    onPlaceOrder,
    onBackToDesign,
    onSave,
    onToggleFullscreen,
    registerSceneContainer,
    onSceneInitialLoadComplete,
  };
};
