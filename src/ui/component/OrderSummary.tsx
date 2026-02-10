
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

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-500 font-normal">{label}</span>
        <span className="text-sm text-gray-900 font-medium capitalize text-right">{value}</span>
    </div>
);

export const OrderSummary = observer(({ onPlaceOrder }: { onPlaceOrder?: () => void }) => {
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
        <div className="bg-white p-6 mt-4 border-t-4 border-gray-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">BeMade™</h2>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-6">Your Design | Our Perfection</p>

                <h3 className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-4">Your Build</h3>

                <div className="flex flex-col">
                    <SummaryRow label="Table Top" value={getTopColorLabel()} />
                    <SummaryRow label="Base" value={getBaseShapeLabel()} />
                    <SummaryRow label="Base Colour" value={getBaseColorLabel()} />
                    <SummaryRow label="Dimensions" value={`Length: ${table.top.length} mm × Width: ${table.top.width} mm`} />
                    <SummaryRow label="Table Top Shape" value={getTopShapeLabel()} />
                    <SummaryRow label="Chair Type" value={getChairShapeLabel()} />
                    <SummaryRow label="Chair Colour" value={getChairColorLabel()} />
                    <SummaryRow label="Chair Quantity" value={chair.position.totalChairs.toString()} />
                </div>
            </div>

            <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Dining Table</span>
                    <span className="text-sm text-gray-900">£{table.top.getPrice().toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                </div>
                {chair.position.totalChairs > 0 && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Dining Chairs ({chair.position.totalChairs})</span>
                        <span className="text-sm text-gray-900">£{chair.getPrice().toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-100 mt-2">
                    <span>Total</span>
                    <span>£{(table.top.getPrice() + chair.getPrice()).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="bg-gray-100 p-3 rounded text-xs text-gray-500 mb-4 leading-relaxed">
                <span className="font-semibold block mb-1">Estimated Delivery:</span>
                Our products are all unique, made to order and this takes some time in our factory.
                Once your order has been made, we will notify and arrange delivery with you. Currently the estimated delivery times are within 14-21 days.
            </div>

            <button
                onClick={onPlaceOrder}
                className="w-full bg-black text-white py-3 px-4 rounded-full font-bold text-sm tracking-wide hover:bg-gray-800 transition"
            >
                PLACE ORDER
            </button>
        </div>
    );
});
