import { createContext, useContext } from "react";
import { Design3DManager } from "../../design3d/managers/Design3DManager";

const Design3DContext = createContext<Design3DManager | null>(null);
const design3DStore = new Design3DManager();

export const Design3DProvider = ({ children }: { children: React.ReactNode }) => (
  <Design3DContext.Provider value={design3DStore}>
    {children}
  </Design3DContext.Provider>
);

export const useDesign3D = () => {
  const ctx = useContext(Design3DContext);
  if (!ctx) throw new Error("Design3DProvider missing");
  return ctx;
};
