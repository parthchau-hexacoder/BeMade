import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Scene } from "./Scene3d/Scene"
import { NAV_ITEMS, Navbar } from "./ui/component/Navbar";
import { SummaryFooter } from "./ui/component/SummaryFooter";
import { CameraCarousel } from "./ui/component/CameraCarousel";
import TableControls from "./ui/table/TableControls"
import { OrderSamplesModal } from "./ui/component/OrderSamplesModal";
import { CheckoutPage } from "./ui/component/CheckoutPage";

const App = () => {
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isSceneLoading, setSceneLoading] = useState(true);
  const [hasSceneReady, setHasSceneReady] = useState(false);
  const [activeNavId, setActiveNavId] = useState('base');
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignRoute = location.pathname === "/";
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
                <div className="h-[42vh] min-h-65 w-full overflow-hidden rounded-xl relative flex items-center justify-center md:h-full md:w-[70%] md:rounded-2xl">
                  <Scene
                    className="w-full h-full"
                    onLoadingChange={setSceneLoading}
                    onInitialLoadComplete={handleInitialLoadComplete}
                  />
                  {isSceneLoading && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-gray-300 bg-white/90 shadow-sm">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center md:bottom-6">
                    <CameraCarousel />
                  </div>
                </div>

                <div className="md:hidden">
                  <nav className="flex items-center gap-6 overflow-x-auto whitespace-nowrap border-b border-gray-200 px-2 pb-2">
                    {NAV_ITEMS.map((item) => {
                      const isActive = item.id === activeNavId;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`
                            relative pb-1 text-xs tracking-widest transition-colors cursor-pointer
                            ${isActive ? "font-semibold text-black" : "font-normal text-gray-400 hover:text-black"}
                          `}
                        >
                          {item.label}
                          {isActive && (
                            <span className="absolute left-0 right-0 -bottom-1.5 h-0.5 bg-black" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

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
