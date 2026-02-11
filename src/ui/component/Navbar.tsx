import React from "react";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import { useAppActions } from "../../app/hooks/useAppActions";

export type NavItem = {
  id: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "base", label: "BASE" },
  { id: "base-colour", label: "BASE COLOUR" },
  { id: "top-colour", label: "TOP COLOUR" },
  { id: "top-shape", label: "TOP SHAPE" },
  { id: "dimension", label: "DIMENSION" },
  { id: "chair", label: "CHAIR" },
  { id: "summary", label: "SUMMARY" },
];

export const Navbar: React.FC = observer(() => {
  const { ui, onNavClick } = useAppActions();
  const location = useLocation();
  const activeId = ui.activeNavId;
  const isCheckoutRoute = location.pathname === "/checkout";

  return (
    <header className="w-full border-b border-gray-300 shadow-xl shadow-zinc-900">
      <div className="mx-auto flex h-[84px] items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-7">
        <img
          className="h-9 md:h-12 md:justify-self-start"
          src="/assets/images/header_logo.svg"
          alt="BeMade"
        />

        {!isCheckoutRoute && (
          <nav className="hidden items-center justify-self-center gap-8 md:flex lg:gap-10">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeId;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavClick(item.id)}
                  className={`relative cursor-pointer pb-1 text-[14px] tracking-[0.04em] transition-colors lg:text-[15px] ${
                    isActive
                      ? "font-semibold text-[#3e4f62]"
                      : "font-normal text-[#444c58] hover:text-black"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[7px] left-0 h-[2px] w-full bg-[#3e4f62]" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {!isCheckoutRoute && (
          <div className="hidden items-center justify-self-end gap-5 md:flex lg:gap-6">
            <button
              type="button"
              className="text-[14px] font-medium text-black transition hover:text-gray-700 lg:text-[15px]"
            >
              Login / Register
            </button>
            <button
              onClick={ui.openOrderModal}
              className="rounded-full bg-black px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-gray-800 lg:text-[15px]"
            >
              Order Sample
            </button>
          </div>
        )}

        {!isCheckoutRoute && (
          <button
            onClick={ui.openOrderModal}
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 md:hidden"
          >
            Order Sample
          </button>
        )}
      </div>
    </header>
  );
});
