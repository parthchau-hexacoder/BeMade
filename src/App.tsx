import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./ui/component/Navbar";
import { SummaryFooter } from "./ui/component/SummaryFooter";
import TableControls from "./ui/table/TableControls"
import { OrderSamplesModal } from "./ui/component/OrderSamplesModal";
import { CheckoutPage } from "./ui/component/CheckoutPage";
import { useDesign } from "./app/providers/DesignProvider";
import { ScenePanel } from "./ui/component/ScenePanel";
import { MobileNav } from "./ui/component/MobileNav";

const App = () => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isSceneLoading, setSceneLoading] = useState(true);
  const [hasSceneReady, setHasSceneReady] = useState(false);
  const [activeNavId, setActiveNavId] = useState('base');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const sceneWrapRef = useRef<HTMLDivElement | null>(null);
  const messageTimeoutRef = useRef<number | null>(null);
  const design = useDesign();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignRoute = location.pathname === "/";

  const showMessage = useCallback((message: string) => {
    setActionMessage(message);
    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = window.setTimeout(() => {
      setActionMessage(null);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);
  const handleNavClick = (id: string) => {
    setActiveNavId(id);
    if (!isDesignRoute) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleInitialLoadComplete = () => setHasSceneReady(true);
  const handlePlaceOrder = () => navigate("/checkout");
  const handleBackToDesign = () => navigate("/");

  const handleSave = useCallback(async () => {
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
    showMessage("Saved locally");
  }, [design, showMessage]);

  const handleToggleFullscreen = useCallback(async () => {
    const container = sceneWrapRef.current;
    if (!container) {
      return;
    }
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else {
        showMessage("Fullscreen not supported");
      }
    } catch (error) {
      showMessage("Fullscreen failed");
    }
  }, [showMessage]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === sceneWrapRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar
        activeId={activeNavId}
        onOrderSampleClick={() => setOrderModalOpen(true)}
        onNavClick={handleNavClick}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex flex-1 w-full flex-col gap-2 overflow-hidden bg-white p-2 relative md:flex-row md:gap-4 md:p-4">
                <ScenePanel
                  containerRef={sceneWrapRef}
                  isFullscreen={isFullscreen}
                  isSceneLoading={isSceneLoading}
                  onLoadingChange={setSceneLoading}
                  onInitialLoadComplete={handleInitialLoadComplete}
                  onSave={handleSave}
                  onToggleFullscreen={handleToggleFullscreen}
                  actionMessage={actionMessage}
                />

                <MobileNav activeId={activeNavId} onNavClick={handleNavClick} />

                <TableControls
                  onPlaceOrder={handlePlaceOrder}
                  onActiveSectionChange={setActiveNavId}
                />
              </div>
              <SummaryFooter />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CheckoutPage onBack={handleBackToDesign} />
            </div>
          }
        />
      </Routes>
      <OrderSamplesModal
        open={isOrderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
      {isSceneLoading && !hasSceneReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-[15px] tracking-wide text-gray-700">
          Loading 3D Configurator...
        </div>
      )}
    </div>

  )
}

export default App
