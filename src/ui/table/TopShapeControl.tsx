import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useDesign } from '../../app/providers/DesignProvider';
import type { TopShapeId } from '../../design/managers/types/table.types';

export const TopShapeControl = observer(() => {

    const {table} = useDesign();
    let manager = table;

    const availableTops = manager.getAvailableShapes();
    const availableSet = useMemo(
        () => new Set<TopShapeId>(availableTops),
        [availableTops]
    );
    const allTops: TopShapeId[] = ['capsule', 'rectangle', 'oval', 'oblong', 'round', 'square'];
    const labels: Record<TopShapeId, string> = {
        capsule: 'Capsule',
        rectangle: 'Rectangle',
        oval: 'Oval',
        oblong: 'Oblong',
        round: 'Round Circle',
        square: 'Square',
    };

    return (
        <div className="bg-white overflow-y-auto p-3 md:p-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Choose Top</h2>

            <div className="grid grid-cols-4 gap-3 md:grid-cols-3 md:gap-4">
                {allTops.map((top) => {
                    const selected = manager.top.id === top;
                    const isAvailable = availableSet.has(top);

                    return (
                        <button
                            key={top}
                            onClick={() => {
                                if (isAvailable) manager.top.setShape(top);
                            }}
                            className={`
                                relative rounded cursor-pointer transition
                                ${isAvailable ? 'hover:scale-[1.01]' : 'cursor-not-allowed'}
                            `}
                            type="button"
                            disabled={!isAvailable}
                            aria-disabled={!isAvailable}
                        >
                            {selected && (
                                <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow md:top-3 md:right-3 md:w-7 md:h-7">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="11" stroke="#111" strokeWidth="1" fill="#fff" />
                                        <path d="M7 13l3 3 7-8" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}

                            <div
                                className={`
                                    aspect-square bg-gray-300 rounded-2xl mb-2 overflow-hidden
                                    ${isAvailable ? '' : 'opacity-50 grayscale'}
                                `}
                            >
                                <img
                                    className="h-full w-full preview-image"
                                    src={`/assets/images/top-shape/${top}/preview.webp`}
                                    alt={labels[top]}
                                />
                            </div>
                            <p
                                className={`
                                    text-xs sm:text-sm md:text-md font-medium text-center
                                    ${isAvailable ? 'text-gray-900' : 'text-gray-400'}
                                `}
                            >
                                {labels[top]}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
