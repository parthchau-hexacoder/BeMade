
import { observer } from 'mobx-react-lite';
import { useDesign } from '../../app/providers/DesignProvider';
const toTitle = (value: string) =>
    value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join(' ');

const FooterItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1 min-w-30">
        <span className="text-md text-gray-500 font-normal tracking-widest">{label}</span>
        <span className="text-ld text-gray-900 font-medium tracking-widest capitalize">{value}</span>
    </div>
);

export const SummaryFooter = observer(() => {
    const { table, chair } = useDesign();

    const getTopShapeLabel = () => {
        return toTitle(table.top.id);
    };

    const getTopColorLabel = () => {
        return toTitle(table.top.materialId);
    };

    const getBaseShapeLabel = () => {
        return toTitle(table.base.id);
    };

    const getBaseColorLabel = () => {
        return table.base.getMaterialName();
    };

    const getChairShapeLabel = () => {
        return chair.id ? toTitle(chair.id) : 'N/A';
    };

    const getChairColorLabel = () => {
        return chair.materialId ? toTitle(chair.materialId) : 'N/A';
    };


    return (
        <footer className="hidden w-full bg-white border-t border-gray-200 px-4 py-4 md:block md:px-10">
            <div className="flex flex-row items-center justify-between mx-auto">
                <FooterItem label="Your Build" value="Dining Table" />
                <FooterItem label="Table Top" value={getTopColorLabel()} />
                <FooterItem label="Table Base" value={getBaseShapeLabel()} />
                <FooterItem label="Table Base Colour" value={getBaseColorLabel()} />
                <FooterItem label="Dimensions (mm)" value={`${table.top.length}×${table.top.width}`} />
                <FooterItem label="Table Top Shape" value={getTopShapeLabel()} />
                <FooterItem label="Chair Style" value={getChairShapeLabel()} />
                <FooterItem label="Chair Color" value={getChairColorLabel()} />
            </div>
        </footer>
    );
});
