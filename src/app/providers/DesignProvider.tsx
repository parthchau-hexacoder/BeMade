import { createContext, useContext } from "react";
import { DesignManager } from "../../design/managers/DesignManager";

const DesignContext = createContext<DesignManager | null>(null);

const designStore = new DesignManager();

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DesignContext.Provider value={designStore}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error("useDesign must be used inside DesignProvider");
  return ctx;
};
