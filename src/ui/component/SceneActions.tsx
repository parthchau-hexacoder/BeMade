import { FiDownload, FiMaximize, FiMinimize, FiShare2 } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import { useAppActions } from "../../app/hooks/useAppActions";

export const SceneActions = observer(() => {
  const { ui, onSave, onToggleFullscreen } = useAppActions();
  const { isFullscreen, actionMessage } = ui;

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2">
      <div className="flex items-center gap-2 rounded-lg p-1 backdrop-blur">
        <button
          type="button"
          onClick={onSave}
          aria-label="Save image"
          title="Save"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <FiDownload size={18} />
        </button>
        <button
          type="button"
          aria-label="Share"
          title="Share"
          disabled
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-400 shadow-sm opacity-60 cursor-not-allowed"
        >
          <FiShare2 size={18} />
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
        </button>
      </div>
      {actionMessage && (
        <div className="rounded-md bg-white/90 px-2 py-1 text-[11px] text-gray-600 shadow-sm">
          {actionMessage}
        </div>
      )}
    </div>
  );
});
