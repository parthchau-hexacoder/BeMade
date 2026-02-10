import { observer } from 'mobx-react-lite';
import type { BaseShape } from '../../design/managers/types/table.types';
import { useDesign } from '../../app/providers/DesignProvider';
import { useDesign3D } from '../../app/providers/Design3DProvider';


export const BaseControl = observer(() => {

    const {table} = useDesign();
    const { camera } = useDesign3D();
    let manager = table.base;

    const bases: BaseShape[] = [ 'linea', 'moon', 'axis', 'cradle', 'curva', 'linea-contour', 'linea-dome', 'twiste'];
    
    return (
        <div className="bg-white overflow-y-auto p-3 md:p-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Choose Base</h2>

            <div className="div grid grid-cols-4 gap-3 md:grid-cols-3 md:gap-4">
                {bases.map((base) => {
                    const selected = manager.id === base;

                    return (
                        <button
                            key={base}
                            onClick={() => {
                                manager.setShape(base);
                                camera.animateToView("front", 1.5);
                            }}
                            className={`
                                relative rounded cursor-pointer transition
                                ${selected ? 'scale-[1.01]' : 'hover:scale-[1.01]'}
                            `}
                            type="button"
                        >
                            {selected && (
                                <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow md:top-3 md:right-3 md:w-7 md:h-7">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="11" stroke="#111" strokeWidth="1" fill="#fff" />
                                        <path d="M7 13l3 3 7-8" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}

                            <div className="aspect-square bg-gray-300 rounded-2xl mb-2 overflow-hidden">
                                <img
                                    className='h-full w-full preview-image'
                                    src={`/assets/images/base-shape/${base}/preview.webp`}
                                    alt={base}
                                />
                            </div>
                            <p className="text-xs sm:text-sm md:text-md font-medium capitalize">
                                {base}
                            </p>
                        </button>
                    );
                })}
            </div>       
        </div>
    )
})
