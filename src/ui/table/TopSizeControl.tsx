import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useDesign } from '../../app/providers/DesignProvider';
import { useDesign3D } from '../../app/providers/Design3DProvider';
import { FiInfo, FiMinus, FiPlus } from 'react-icons/fi';

const SliderControl = ({
    label,
    value,
    options,
    onChange,
    onCommit
}: {
    label: string;
    value: number;
    options: number[];
    onChange: (newValue: number) => void;
    onCommit?: (newValue: number) => void;
}) => {
    const propIndex = options.indexOf(value);
    const [localIndex, setLocalIndex] = useState(propIndex);
    const maxIndex = options.length - 1;
    // Sync with external state changes
    useEffect(() => {
        setLocalIndex(propIndex);
    }, [propIndex]);

    const commitChange = useCallback((newIndex: number) => {
        if (options[newIndex] !== undefined) {
            onChange(options[newIndex]);
        }
    }, [onChange, options]);

    const commitViewChange = useCallback((newIndex: number) => {
        if (options[newIndex] !== undefined) {
            onCommit?.(options[newIndex]);
        }
    }, [onCommit, options]);

    const percentage = maxIndex > 0 ? (localIndex / maxIndex) * 100 : 0;

    const handleIncrement = () => {
        if (localIndex < maxIndex) {
            const newIndex = localIndex + 1;
            setLocalIndex(newIndex);
            commitChange(newIndex);
            commitViewChange(newIndex);
        }
    };

    const handleDecrement = () => {
        if (localIndex > 0) {
            const newIndex = localIndex - 1;
            setLocalIndex(newIndex);
            commitChange(newIndex);
            commitViewChange(newIndex);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = Number(e.target.value);
        setLocalIndex(newIndex);
        commitChange(newIndex);
    };

    const handleCommit = () => {
        commitViewChange(localIndex);
    };

    return (
        <div className="mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">{label}</h3>

            <div className="flex items-center gap-3 md:gap-4">
                <button
                    onClick={handleDecrement}
                    className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    aria-label="Decrease"
                >
                    <FiMinus className="text-gray-700" size={14} />
                </button>

                <div className="relative flex-1 h-8 flex items-center">
                    <input
                        type="range"
                        min={0}
                        max={maxIndex}
                        step="1"
                        value={localIndex}
                        onChange={handleChange}
                        onMouseUp={handleCommit}
                        onTouchEnd={handleCommit}
                        onKeyUp={handleCommit}
                        className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer z-10 relative"
                        style={{
                            backgroundImage: `linear-gradient(to right, #9CA3AF ${percentage}%, #E5E7EB ${percentage}%)`
                        }}
                    />
                    <style>{`
                        input[type=range]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            height: 24px;
                            width: 24px;
                            border-radius: 50%;
                            background: #E5E7EB;
                            border: 2px solid #374151;
                            cursor: pointer;
                            margin-top: -4px; 
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        }
                        input[type=range]::-webkit-slider-runnable-track {
                            width: 100%;
                            height: 16px;
                            cursor: pointer;
                            border-radius: 999px;
                        }
                    `}</style>
                </div>

                <button
                    onClick={handleIncrement}
                    className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    aria-label="Increase"
                >
                    <FiPlus className="text-gray-700" size={14} />
                </button>
            </div>

            <div className="text-center mt-2">
                <span className="text-base md:text-lg text-gray-700">{options[localIndex]}mm</span>
            </div>
        </div>
    );
};

export const TopSizeControl = observer(() => {
    const { table } = useDesign();
    const { camera } = useDesign3D();
    const manager = table.top;

    return (
        <div className="bg-white p-4 md:p-6 border-b">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">Dimensions</h2>

            <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 mb-6 md:mb-8 shadow-sm flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <FiInfo className="text-white" size={18} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                    All table heights are fixed between <span className="font-bold text-gray-900">730mm to 750mm</span>
                </p>
            </div>

            <SliderControl
                label="Top Length"
                value={manager.length}
                options={manager.getValidLengths()}
                onChange={(val) => {
                    manager.setLength(val);
                }}
                onCommit={() => {
                    camera.animateToView("top", 1.8);
                }}
            />

            {manager.id !== 'round' && manager.id !== 'square' && (
                <SliderControl
                    label="Top Width"
                    value={manager.width}
                    options={manager.getValidWidths()}
                    onChange={(val) => {
                        manager.setWidth(val);
                    }}
                    onCommit={() => {
                        camera.animateToView("top", 1.8);
                    }}
                />
            )}
        </div>
    );
});
