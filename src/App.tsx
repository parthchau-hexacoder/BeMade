import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./ui/component/Navbar";
import { SummaryFooter } from "./ui/component/SummaryFooter";
import TableControls from "./ui/table/TableControls"
import { OrderSamplesModal } from "./ui/component/OrderSamplesModal";
import { CheckoutPage } from "./ui/component/CheckoutPage";
import { ScenePanel } from "./ui/component/ScenePanel";
import { MobileNav } from "./ui/component/MobileNav";
import { useAppActions } from "./app/hooks/useAppActions";
import { useAppLifecycle } from "./app/hooks/useAppLifecycle";

const App = observer(() => {
  const { ui } = useAppActions();
  useAppLifecycle();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex flex-1 w-full flex-col gap-2 overflow-hidden bg-white p-2 relative md:flex-row md:gap-4 md:p-4">
                <ScenePanel />

                <MobileNav />

                <TableControls />
              </div>
              <SummaryFooter />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CheckoutPage />
            </div>
          }
        />
      </Routes>
      <OrderSamplesModal
        open={ui.isOrderModalOpen}
        onClose={ui.closeOrderModal}
      />
      {ui.isSceneLoading && !ui.hasSceneReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-[15px] tracking-wide text-gray-700">
          Loading 3D Configurator...
        </div>
      )}
    </div>

  )
});

export default App
