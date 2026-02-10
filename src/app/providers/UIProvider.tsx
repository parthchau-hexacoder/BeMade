import type React from "react";
import { createContext, useContext } from "react";
import { UIManager } from "../managers/UIManager";

const UIContext = createContext<UIManager | null>(null);

const uiStore = new UIManager();

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <UIContext.Provider value={uiStore}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
};
