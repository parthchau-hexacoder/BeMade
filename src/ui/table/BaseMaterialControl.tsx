import { observer } from 'mobx-react-lite'
import { useDesign } from '../../app/providers/DesignProvider';


export const BaseMaterialControl = observer(() => {

    const { table } = useDesign();
    let manager = table.base;

    const materials = manager.getAvailableMaterialOptions();

    return (
        <div className="bg-white overflow-y-auto p-3 md:p-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Choose Base Colour</h2>

            <div className="div grid grid-cols-4 gap-2">
                {materials.map((material) => {
                    const selected = manager.materialId === material.id;

                    return (
                        <button
                            key={material.id}
                            onClick={() => {
                                manager.setMaterialId(material.id)
                            }}
                            className="relative rounded-2xl p-2 cursor-pointer transition hover:scale-[1.01] "
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
                            <div className="mb-2 rounded-2xl overflow-hidden">
                                <img
                                    className='h-full w-full'
                                    src={`/assets/images/base-shape/${manager.id}/${material.folder}/preview.webp`} alt={material.name} />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 font-medium">{material.name}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
})
