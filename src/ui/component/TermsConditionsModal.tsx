import { useEffect, useState } from "react";

type TermsConditionsModalProps = {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
  hasAccepted: boolean;
};

export const TermsConditionsModal = ({
  open,
  onClose,
  onAgree,
  hasAccepted,
}: TermsConditionsModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (open) {
      setIsChecked(hasAccepted);
    }
  }, [open, hasAccepted]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[92vw] overflow-hidden rounded-lg bg-white shadow-2xl sm:max-w-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-black px-4 py-2.5">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">Terms &amp; Conditions</h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-white"
            aria-label="Close terms and conditions"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-4 py-4 text-sm leading-relaxed text-gray-700 sm:px-5">
          <p className="mb-3">
            By placing an order, you confirm that your configuration details are accurate and final.
          </p>
          <p className="mb-3">
            All products are made to order. Orders can be changed or cancelled within 48 hours of placement.
            After that, production starts and changes may not be possible.
          </p>
          <p className="mb-3">
            Delivery timelines are estimates and may vary based on production and logistics constraints.
          </p>
          <p>
            You agree that materials and finishes may have natural variation, which is part of bespoke manufacturing.
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-3 sm:px-5">
          <label className="mb-3 flex cursor-pointer items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <span>I have read and agree to the Terms &amp; Conditions.</span>
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onAgree}
              disabled={!isChecked}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isChecked
                  ? "bg-black text-white hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-200 text-gray-500"
              }`}
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
