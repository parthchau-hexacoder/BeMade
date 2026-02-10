import { SquareLoader } from "./SquareLoader";

type FullScreenLoaderProps = {
  label?: string;
};

export const FullScreenLoader = ({
  label = "Loading 3D Configurator...",
}: FullScreenLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white text-[15px] tracking-wide text-gray-700">
      <SquareLoader />
      <span>{label}</span>
    </div>
  );
};
