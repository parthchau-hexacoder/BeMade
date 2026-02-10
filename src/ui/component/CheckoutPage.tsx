import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useAppActions } from '../../app/hooks/useAppActions';
import { useLocation } from 'react-router-dom';
import { useDesign } from '../../app/providers/DesignProvider';
import { TermsConditionsModal } from './TermsConditionsModal';
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

export const CheckoutPage = observer(() => {
    const { table, chair, samples, samplesPrice, checkoutPreviewImage } = useDesign();
    const { onBackToDesign } = useAppActions();
    const location = useLocation();
    const isSamplesOnlyCheckout = new URLSearchParams(location.search).get('mode') === 'samples';
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const tablePrice = table.top.getPrice();
    const chairPrice = chair.getPrice();
    const designTotal = tablePrice + chairPrice;
    const payableTotal = isSamplesOnlyCheckout ? samplesPrice : designTotal;

    const formatGBP = (amount: number) =>
        `\u00a3${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const formatLabel = (id: string) =>
        id
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');

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
        <div className="flex-1 w-full bg-white px-4 py-6 sm:px-6 md:px-12 md:py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 md:gap-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 md:mb-8">
                        {isSamplesOnlyCheckout ? 'Sample Checkout' : 'Checkout'}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Full Name <span className="text-red-500">*</span></label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter full name" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Address Line 1 <span className="text-red-500">*</span></label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter address line 1" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Address Line 2</label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter address line 2 (optional)" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">City <span className="text-red-500">*</span></label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter city" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Postcode <span className="text-red-500">*</span></label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter postcode" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">County</label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter county" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Phone Number <span className="text-red-500">*</span></label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter phone number" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600 font-medium">Email Address <span className="text-red-500">*</span></label>
                            <input className="h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="Enter email address" />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center">
                        <button
                            onClick={onBackToDesign}
                            className="h-11 px-6 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            &#8249; Back to Design
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsTermsOpen(true)}
                            className="h-11 px-6 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
                        >
                            Terms &amp; Conditions
                        </button>
                        <button
                            type="button"
                            disabled={!hasAcceptedTerms}
                            className={`h-11 px-6 rounded-full text-sm font-semibold transition ${hasAcceptedTerms
                                ? 'bg-black text-white hover:bg-gray-800'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Pay Now &gt;
                        </button>
                    </div>

                    {isSamplesOnlyCheckout && (
                        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Selected Samples</h2>
                            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
                                {samples.length > 0 ? (
                                    samples.map((sample) => (
                                        <div
                                            key={sample}
                                            className="relative overflow-hidden rounded-xl border border-gray-300"
                                        >
                                            <div className="absolute right-1.5 top-1.5 z-10 h-5 w-5 rounded-full bg-white/95 shadow">
                                                <svg viewBox="0 0 24 24" className="h-full w-full p-1 text-black" fill="none">
                                                    <path d="M6 12.5l3.2 3.2L18 7.9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <img
                                                src={`/assets/images/top-color/${sample}/preview.webp`}
                                                alt={formatLabel(sample)}
                                                className="aspect-square w-full object-cover"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No samples selected.</p>
                                )}
                            </div>

                            <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-500">Samples Total</p>
                                    <p className="text-lg font-semibold text-gray-900">GBP {samplesPrice}</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Selected: <span className="font-semibold text-gray-900">{samples.length}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-start gap-3 text-xs text-gray-500">
                        <div className="h-5 w-5 rounded bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">i</div>
                        <p>
                            <span className="font-semibold text-gray-700 mr-2">IMPORTANT</span>
                            Due to the bespoke nature of your order, we can only provide 48 hours after placing your order,
                            where you may cancel or make any changes before production process begins. After this point,
                            cancellations and amendments will not be possible.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-6 md:p-8">
                    <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm">
                        <div className="h-40 w-full rounded-lg bg-linear-to-br from-gray-200 to-gray-100 mb-6 overflow-hidden">
                            {checkoutPreviewImage ? (
                                <img
                                    src={checkoutPreviewImage}
                                    alt="Current configuration"
                                    className="h-full w-full object-cover"
                                />
                            ) : null}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">BeMade{'\u2122'}</h2>
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-6">Your Design | Our Perfection</p>

                        <h3 className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-4">
                            {isSamplesOnlyCheckout ? 'Your Samples' : 'Your Build'}
                        </h3>
                        <div className="flex flex-col">
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Table Top" value={getTopColorLabel()} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Base" value={getBaseShapeLabel()} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Base Colour" value={getBaseColorLabel()} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Dimensions" value={`Length: ${table.top.length} mm \u00d7 Width: ${table.top.width} mm`} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Table Top Shape" value={getTopShapeLabel()} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Chair Type" value={getChairShapeLabel()} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Chair Colour" value={getChairColorLabel()} />
                            )}
                            {!isSamplesOnlyCheckout && (
                                <SummaryRow label="Chair Quantity" value={chair.position.totalChairs.toString()} />
                            )}
                            {isSamplesOnlyCheckout && (
                                <SummaryRow label="Samples Selected" value={samples.length.toString()} />
                            )}
                            {isSamplesOnlyCheckout && (
                                <SummaryRow label="Samples Total" value={`GBP ${samplesPrice}`} />
                            )}
                        </div>
                        <div className="mt-5 border-t border-gray-200 pt-4">
                            {!isSamplesOnlyCheckout && (
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Dining Table</span>
                                    <span className="text-sm text-gray-900">{formatGBP(tablePrice)}</span>
                                </div>
                            )}
                            {!isSamplesOnlyCheckout && chair.position.totalChairs > 0 && (
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Dining Chairs ({chair.position.totalChairs})</span>
                                    <span className="text-sm text-gray-900">{formatGBP(chairPrice)}</span>
                                </div>
                            )}
                            {isSamplesOnlyCheckout && (
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Sample Pack</span>
                                    <span className="text-sm text-gray-900">{formatGBP(samplesPrice)}</span>
                                </div>
                            )}
                            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
                                <span className="text-base font-semibold text-gray-900">Total Payable</span>
                                <span className="text-lg font-bold text-gray-900">{formatGBP(payableTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TermsConditionsModal
                open={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                hasAccepted={hasAcceptedTerms}
                onAgree={() => {
                    setHasAcceptedTerms(true);
                    setIsTermsOpen(false);
                }}
            />
        </div>
    );
});
