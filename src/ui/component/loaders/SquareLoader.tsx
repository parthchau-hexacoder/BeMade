type SquareLoaderProps = {
  sizeClassName?: string;
  spinnerClassName?: string;
  className?: string;
};

export const SquareLoader = ({
  sizeClassName = "h-14 w-14",
  spinnerClassName = "h-6 w-6",
  className = "",
}: SquareLoaderProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white/90 shadow-sm ${sizeClassName} ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-2 border-gray-400 border-t-transparent ${spinnerClassName}`}
      />
    </div>
  );
};
