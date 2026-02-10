import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { FiArrowRight, FiX } from 'react-icons/fi';
import { useDesign } from '../../app/providers/DesignProvider';

type Props = {
  open: boolean;
  onClose: () => void;
};

type Category = {
  label: string;
  items: string[];
};

type HoverPreview = {
  material: string;
  left: number;
  top: number;
};

const formatLabel = (id: string) =>
  id
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const OrderSamplesModal = observer(({ open, onClose }: Props) => {
  const { table } = useDesign();
  const materials = table.top.getAvailableMaterals();
  const [selected, setSelected] = useState<string[]>([]);
  const [hoverPreview, setHoverPreview] = useState<HoverPreview | null>(null);

  const categories = useMemo<Category[]>(() => {
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
    const silk = ['shadow_white', 'aristocrat'];

    const available = new Set(materials);
    const used = new Set<string>();
    const pick = (ids: string[]) =>
      ids.filter((id) => available.has(id) && !used.has(id) && used.add(id));

    const groups: Category[] = [
      { label: 'Natural', items: pick(natural) },
      { label: 'Polish', items: pick(polish) },
      { label: 'Silk', items: pick(silk) },
      { label: 'Other', items: materials.filter((id) => !used.has(id)) },
    ];

    return groups.filter((group) => group.items.length > 0);
  }, [materials]);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTileEnter = (
    material: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cardWidth = 430;
    const cardHeight = 620;
    const gap = 12;
    const viewportPadding = 12;

    let left = rect.right + gap;
    if (left + cardWidth > window.innerWidth - viewportPadding) {
      left = rect.left - cardWidth - gap;
    }
    if (left < viewportPadding) {
      left = viewportPadding;
    }

    let top = rect.top;
    const maxTop = window.innerHeight - cardHeight - viewportPadding;
    if (top > maxTop) {
      top = Math.max(viewportPadding, maxTop);
    }

    setHoverPreview({ material, left, top });
  };

  const getMaterialDescription = (id: string) => {
    const naturalIds = new Set([
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
    ]);
    const polishIds = new Set([
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
    ]);

    if (naturalIds.has(id)) {
      return 'Rich natural texture with layered stone veining for an organic, timeless look.';
    }
    if (polishIds.has(id)) {
      return 'Refined polished surface with vivid contrast and depth for a premium modern finish.';
    }
    return 'Elegant stone-inspired finish designed to complement contemporary interiors.';
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[92vw] overflow-hidden rounded-lg bg-white shadow-2xl sm:max-w-2xl md:max-w-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-black px-4 py-2.5">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">Order Samples</h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-white"
            aria-label="Close order samples"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-3 py-3">
          <section className="mb-4 rounded-lg bg-gray-100 px-4 py-3">
            <h4 className="mb-2 text-lg font-semibold text-gray-700 sm:text-xl">Sample Pricing</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 sm:text-base">
              <li>A pair of samples costs GBP 20.</li>
              <li>Ordering just one sample is also GBP 20.</li>
              <li>
                For more than two samples, it costs GBP 20 for every additional pair.
                A single extra sample also counts as a full pair.
              </li>
              <li>Please select your samples below:</li>
            </ul>
          </section>

          {categories.map((group) => (
            <section key={group.label} className="mb-5">
              <h5 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl">{group.label}</h5>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                {group.items.map((material) => {
                  const isSelected = selected.includes(material);
                  return (
                    <button
                      key={material}
                      onClick={() => toggleSelection(material)}
                      onMouseEnter={(event) => handleTileEnter(material, event)}
                      onMouseLeave={() => setHoverPreview(null)}
                      className={`
                        relative overflow-hidden rounded-xl border transition
                        ${isSelected ? 'border-gray-900 ring-2 ring-gray-700' : 'border-gray-200'}
                      `}
                      title={formatLabel(material)}
                    >
                      <img
                        src={`/assets/images/top-color/${material}/preview.webp`}
                        alt={formatLabel(material)}
                        className="h-20 w-full object-cover sm:h-24 md:h-[96px]"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex items-center justify-center border-t border-gray-300 px-3 py-2.5 sm:justify-end">
          <button
            className={`
              w-full rounded-full px-5 py-2 text-base transition sm:w-auto sm:py-1.5 sm:text-xl
              ${selected.length > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'}
            `}
            disabled={selected.length === 0}
          >
            <span className="inline-flex items-center gap-1">
              Buy Now
              <FiArrowRight size={18} />
            </span>
          </button>
        </div>

        {hoverPreview && (
          <div
            className="hidden w-70 pointer-events-none fixed z-[70] rounded-2xl bg-white p-3 shadow-2xl md:block"
            style={{ left: hoverPreview.left, top: hoverPreview.top }}
          >
            <div className="overflow-hidden rounded-xl bg-gray-100">
              <img
                src={`/assets/images/top-color/${hoverPreview.material}/sample_preview.webp`}
                alt={formatLabel(hoverPreview.material)}
                className="object-contain"
              />
            </div>
            <div className="pt-2">
              <p className="text-xl font-semibold text-gray-900">{formatLabel(hoverPreview.material)}</p>
              <p className="text-sm text-gray-600">{getMaterialDescription(hoverPreview.material)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
