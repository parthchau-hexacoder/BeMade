import { NAV_ITEMS } from "./Navbar";

type Props = {
  activeId: string;
  onNavClick: (id: string) => void;
};

export const MobileNav = ({ activeId, onNavClick }: Props) => {
  return (
    <div className="md:hidden">
      <nav className="flex items-center gap-6 overflow-x-auto whitespace-nowrap border-b border-gray-200 px-2 pb-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
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
  );
};
