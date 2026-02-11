import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDesign } from "../providers/DesignProvider";
import { useUI } from "../providers/UIProvider";
import { DESIGN_SHARE_QUERY_KEY, DESIGN_STORAGE_KEY } from "../constants/storage";
import { useDesign3D } from "../providers/Design3DProvider";
import { encodeDesignPayload } from "../utils/designShare";
import type { PersistedDesignPayload } from "../../design/managers/DesignManager";

export const useAppActions = () => {
  const ui = useUI();
  const design = useDesign();
  const { camera } = useDesign3D();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignRoute = location.pathname === "/";

  const buildPersistedPayload = useCallback(
    (): PersistedDesignPayload => ({
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
    }),
    [design]
  );

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

  const waitForNextPaint = useCallback(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      }),
    []
  );

  const onPlaceOrder = useCallback(async () => {
    if (camera.currentView !== "rightTop") {
      await camera.animateToView("rightTop", 1.1);
      await waitForNextPaint();
    }

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
  }, [camera, design, navigate, ui, waitForNextPaint]);

  const onBackToDesign = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onSave = useCallback(() => {
    const payload = buildPersistedPayload();
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(payload));
    ui.showActionMessage("Saved locally");
  }, [buildPersistedPayload, ui]);

  const onShare = useCallback(async () => {
    const payload = buildPersistedPayload();
    const token = encodeDesignPayload(payload);
    if (!token) {
      ui.showActionMessage("Share link failed");
      return;
    }

    const shareUrl = new URL(window.location.href);
    shareUrl.pathname = "/";
    shareUrl.search = "";
    shareUrl.hash = "";
    shareUrl.searchParams.set(DESIGN_SHARE_QUERY_KEY, token);

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(payload));
      ui.showActionMessage("Share link copied");
    } catch {
      ui.showActionMessage("Clipboard blocked");
    }
  }, [buildPersistedPayload, ui]);

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
    onShare,
    onToggleFullscreen,
    registerSceneContainer,
    onSceneInitialLoadComplete,
  };
};
