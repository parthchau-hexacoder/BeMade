import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDesign3D } from "../../app/providers/Design3DProvider";
import { useDesign } from "../../app/providers/DesignProvider";
import type { CameraViewPreset } from "../../design3d/managers/CameraManager";

type Props = {
  className?: string;
};

export const CameraCarousel = observer(({ className }: Props) => {
  const { camera } = useDesign3D();
  const { chair } = useDesign();

  const hasChairs = chair.position.totalChairs > 0;
  const viewOptions = useMemo(
    () => camera.getViewOptions(hasChairs),
    [camera, hasChairs]
  );

  const [index, setIndex] = useState(() =>
    Math.max(0, viewOptions.indexOf(camera.currentView))
  );

  const animateToPreset = useCallback(
    (preset: CameraViewPreset) => {
      const duration =
        preset === "top" || preset === "topWithChairs" ? 1.8 : 1.1;
      camera.animateToView(preset, duration);
    },
    [camera]
  );

  useEffect(() => {
    const currentIndex = viewOptions.indexOf(camera.currentView);
    if (currentIndex !== -1) {
      setIndex(currentIndex);
      return;
    }

    setIndex(0);
    if (viewOptions[0]) {
      animateToPreset(viewOptions[0]);
    }
  }, [viewOptions, camera.currentView, animateToPreset]);

  const goTo = (nextIndex: number) => {
    const clamped = (nextIndex + viewOptions.length) % viewOptions.length;
    setIndex(clamped);
    animateToPreset(viewOptions[clamped]);
  };

  if (!viewOptions.length) return null;

  return (
    <div
      className={`pointer-events-auto select-none ${className ?? ""}`}
    >
      <div className="flex items-center justify-center gap-3 rounded-full bg-white/80 px-3 py-1.5 shadow-md md:gap-4 md:px-4 md:py-2">
        <button
          type="button"
          aria-label="Previous view"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 hover:bg-gray-50 md:h-8 md:w-8"
          onClick={() => goTo(index - 1)}
        >
          <FiChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {viewOptions.map((preset, i) => (
            <button
              key={preset}
              type="button"
              aria-label={`View ${preset}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-gray-700" : "bg-gray-300"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next view"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 hover:bg-gray-50 md:h-8 md:w-8"
          onClick={() => goTo(index + 1)}
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
});
