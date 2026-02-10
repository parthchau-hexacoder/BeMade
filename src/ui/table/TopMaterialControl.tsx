import { observer } from 'mobx-react-lite'
import { useMemo } from 'react';
import { useDesign } from '../../app/providers/DesignProvider';
import { useDesign3D } from '../../app/providers/Design3DProvider';


export const TopMaterialControls = observer(() => {

    const {table} = useDesign();
    const { camera } = useDesign3D();
    let manager = table.top;

    const materials = manager.getAvailableMaterals();
    const materialSet = useMemo(() => new Set(materials), [materials]);

    const formatLabel = (id: string) =>
        id
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
            .replace('Taj Mahal', 'Taj Mahal')
            .replace('Mont Blanc Texture', 'Mont Blanc Texture');

    const categories = useMemo(() => {
        const natural = [
            'amani_grey',
            'anatolia',
            'calacatta_black',
            'pietra_stone',
            'roman',
            'storm',
            'magma',
            'noce',
            'taj_mahal',
            'velvet_black',
            'sienna_bronze',
            'vintage_bronze',
        ];

        const polish = [
            'fior',
            'gold_onyx',
            'lucid',
            'pearl_mist',
            'calacatta_lux',
            'cartier_gold',
            'elegance',
            'orova',
            'premium_gold',
            'velvet',
            'veneto',
            'desert_dune',
            'venus_vein',
        ];

        const silk = [
            'shadow_white',
            'aristocrat',
        ];

        const used = new Set<string>();
        const pick = (ids: string[]) =>
            ids.filter((id) => materialSet.has(id) && !used.has(id) && used.add(id));

        const naturalItems = pick(natural);
        const polishItems = pick(polish);
        const silkItems = pick(silk);
        const otherItems = materials.filter((id) => !used.has(id));

        return [
            { label: 'Natural', items: naturalItems },
            { label: 'Polish', items: polishItems },
            { label: 'Silk', items: silkItems },
            { label: 'Other', items: otherItems },
        ].filter((group) => group.items.length > 0);
    }, [materialSet, materials]);

    return (
        <div className="bg-white overflow-y-auto p-3 md:p-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Choose Base Colour</h2>

                {categories.map((group) => (
                    <div key={group.label} className="mb-8">
                        <div className="inline-flex items-center rounded-md border border-gray-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-700 sm:text-xs">
                            {group.label}
                        </div>
                        <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-3">
                            {group.items.map((material) => {
                                const selected = manager.materialId === material;
                                return(
                                    <div 
                                    key={material}
                                    onClick={()=>{
                                        manager.setMaterial(material)
                                        camera.animateToView("top", 1.8)
                                    }}
                                    className={`rounded-2xl p-2 cursor-pointer border ${selected ? 'border-gray-900' : 'border-transparent'} hover:border-gray-400`}>
                                        <div className="mb-2 aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                            <img 
                                                className='h-full w-full object-cover'
                                                src={`/assets/images/top-color/${material}/preview.webp`} alt={material} />
                                        </div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-800">{formatLabel(material)}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}      
            </div>
    )
})
