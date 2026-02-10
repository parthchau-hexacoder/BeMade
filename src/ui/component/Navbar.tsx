import React from "react";

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

type Props = {
  activeId?: string;
  onOrderSampleClick?: () => void;
  onNavClick?: (id: string) => void;
};

export const Navbar: React.FC<Props> = ({ activeId = "base", onOrderSampleClick, onNavClick }) => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-3xl font-light tracking-wide text-black">
            <img className="h-8 md:h-10" src="/assets/images/header_logo.svg" alt="" />
          </div>
          <button
            onClick={onOrderSampleClick}
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 md:hidden"
          >
            Order Sample
          </button>
        </div>

        <nav className="hidden items-center gap-6 overflow-x-auto whitespace-nowrap pb-1 md:flex md:overflow-visible md:pb-0">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                onClick={() => onNavClick?.(item.id)}
                className={`
                  relative pb-1 text-xs tracking-widest transition-colors cursor-pointer sm:text-sm md:text-md
                  ${
                    isActive
                      ? "font-semibold text-black"
                      : "font-normal text-gray-400 hover:text-black"
                  }
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

        <button
          onClick={onOrderSampleClick}
          className="hidden rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer md:inline-flex"
        >
          Order Sample
        </button>
      </div>
    </header>
  );
};
