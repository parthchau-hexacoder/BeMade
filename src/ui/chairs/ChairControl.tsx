import { observer } from 'mobx-react-lite';
import { useDesign } from '../../app/providers/DesignProvider';
import { useDesign3D } from '../../app/providers/Design3DProvider';

export const ChairControl = observer(() => {
    const { chair, table } = useDesign();
    const { camera } = useDesign3D();
    const manager = chair;
    const position = chair.position;

    const decrement = () => {
        const next = position.totalChairs - 2;
        if( next === 0 ){
            camera.animateToView("front", 1.5);
        }
        position.setTotalChairs(next);
    };

    const increment = () => {
        const next = position.totalChairs + 2;
        if (next <= position.getMaxAllowedChairs()) {
            position.setTotalChairs(next);
            camera.animateToView("rightTop", 1.5);
        }
    };

    return (
        <div className="bg-white overflow-y-auto p-3 md:p-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Wear It With</h2>

            <div className="grid grid-cols-4 gap-3 mb-6 md:grid-cols-3 md:mb-8 md:gap-4">
                {manager.getAvailableShapes().map((shape) => {
                    const selected = manager.id === shape;

                    return (
                        <div
                            key={shape}
                            onClick={() => manager.setShape(shape)}
                            className={`
                                relative rounded-lg p-3 cursor-pointer
                                transition transform
                                ${selected ? 'scale-105' : 'hover:scale-102'}
                            `}
                        >
                            {selected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow md:top-3 md:right-3 md:w-7 md:h-7">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="11" stroke="#111" strokeWidth="1" fill="#fff" />
                                        <path d="M7 13l3 3 7-8" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}

                            <div className="p-2 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                <img
                                    className="h-full w-full object-contain"
                                    src={`/assets/images/accessories/${shape}/preview.webp`}
                                    alt={shape}
                                />
                            </div>

                            <p className="mt-3 text-sm md:text-base font-medium capitalize px-2">
                                {shape}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-3">Select Chair Color</h3>

                <div className="flex items-center gap-3">
                    {manager.getAvailableMaterals().map((material) => {
                        const selected = manager.materialId === material;

                        return (
                            <button
                                key={material}
                                onClick={() => manager.setMaterial(material)}
                                className={`
                                    h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center
                                    transition
                                    ${selected ? 'ring-2 ring-black' : ''}
                                `}
                            >
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={`/assets/images/accessories/${manager.id}/${material}/preview.webp`}
                                        alt={material}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base md:text-lg font-semibold">Select Chair Quantity</h3>
                    <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs" title={table.top.getSeatCapacity()}>
                        i
                    </div>
                </div>

                <div className="inline-flex items-center rounded-lg overflow-hidden border border-gray-300 mb-2">
                    <button
                        onClick={decrement}
                        disabled={position.totalChairs <= 0}
                        className="px-3 py-2 bg-gray-300 text-gray-700 disabled:opacity-50 md:px-4"
                    >
                        −
                    </button>

                    <div className="px-5 py-2 bg-white text-center text-sm min-w-12 md:px-6">
                        {position.totalChairs}
                    </div>

                    <button
                        onClick={increment}
                        disabled={position.totalChairs >= position.getMaxAllowedChairs()}
                        className="px-3 py-2 bg-black text-white disabled:opacity-50 md:px-4"
                    >
                        +
                    </button>
                </div>

                <p className="text-sm font-medium text-gray-800 mb-1">
                    {table.top.getSeatCapacity()}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                    Chairs are placed symmetrically around the table.
                </p>
            </div>
        </div>
    );
});
