import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { FiInfo, FiX } from "react-icons/fi";
import { useDesign } from "../../app/providers/DesignProvider";

type MaterialMeta = {
  category: string;
  description: string;
};

const MATERIAL_META: Record<string, MaterialMeta> = {
  amani_grey: {
    category: "Natural",
    description:
      "A sophisticated grey stone with subtle veining and a contemporary look for modern spaces.",
  },
  anatolia: {
    category: "Natural",
    description:
      "A light marble-style surface with soft movement that keeps the table bright and refined.",
  },
  calacatta_black: {
    category: "Natural",
    description:
      "A dramatic dark stone effect with bold veining, ideal for a strong statement finish.",
  },
  taj_mahal: {
    category: "Natural",
    description:
      "A warm and elegant neutral stone look with gentle veining that suits both classic and modern interiors.",
  },
  pietra_stone: {
    category: "Natural",
    description:
      "A textured mid-grey stone look that adds depth while staying balanced and versatile.",
  },
  storm: {
    category: "Natural",
    description:
      "A cool-toned, cloudy stone pattern with layered detail for a clean architectural feel.",
  },
};

const NATURAL_SET = new Set([
  "amani_grey",
  "anatolia",
  "calacatta_black",
  "pietra_stone",
  "roman",
  "storm",
  "magma",
  "noce",
  "taj_mahal",
  "velvet_black",
  "sienna_bronze",
  "vintage_bronze",
]);

const POLISH_SET = new Set([
  "fior",
  "gold_onyx",
  "lucid",
  "pearl_mist",
  "calacatta_lux",
  "cartier_gold",
  "elegance",
  "orova",
  "premium_gold",
  "velvet",
  "veneto",
  "desert_dune",
  "venus_vein",
]);

const SILK_SET = new Set(["shadow_white", "aristocrat"]);

const formatLabel = (id: string) =>
  id
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getCategory = (materialId: string) => {
  if (NATURAL_SET.has(materialId)) return "Natural";
  if (POLISH_SET.has(materialId)) return "Polish";
  if (SILK_SET.has(materialId)) return "Silk";
  return "Material";
};

const getFallbackDescription = (category: string, label: string) => {
  if (category === "Polish") {
    return `${label} offers a polished finish with crisp detail and a clean, premium appearance.`;
  }
  if (category === "Silk") {
    return `${label} has a soft, silky texture for a subtle and elegant tabletop finish.`;
  }
  return `${label} provides a natural stone-inspired look with rich character and everyday versatility.`;
};

export const TopMaterialInfo = observer(() => {
  const { table } = useDesign();
  const [isOpen, setIsOpen] = useState(true);
  const materialId = table.top.materialId;

  const content = useMemo(() => {
    const label = formatLabel(materialId);
    const category = MATERIAL_META[materialId]?.category ?? getCategory(materialId);
    const description =
      MATERIAL_META[materialId]?.description ??
      getFallbackDescription(category, label);

    return { label, category, description };
  }, [materialId]);

  return (
    <div className="absolute bottom-4 left-4 z-20 md:bottom-5 md:left-5">
      <button
        type="button"
        aria-label="Show top material info"
        title="Material info"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white/90 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white"
      >
        <FiInfo size={16} />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-[#eeeeef] p-4 shadow-xl">
          <button
            type="button"
            aria-label="Close material info"
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 text-gray-500 transition hover:text-gray-700"
          >
            <FiX size={18} />
          </button>
          <p className="pr-8 text-xl font-semibold leading-none text-gray-900">
            {content.label}
          </p>
          <div className="mt-2 inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-600">
            {content.category}
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {content.description}
          </p>
        </div>
      )}
    </div>
  );
});
