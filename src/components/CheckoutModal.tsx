"use client";

import { useState, useEffect } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "ebook" | "hardcopy" | "bundle" | null;
}

// Elegant Loader2 component (matches Lucide Loader2 exactly with zero package footprint)
function Loader2Icon({
  className = "animate-spin h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function CheckoutModal({
  isOpen,
  onClose,
  initialType = null,
}: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Please enter your name and email.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = "/api/checkout/ebook";
      const payload = { name, email };

      // Aesthetics delay of at least 1.5 seconds for paying securely
      const [response] = await Promise.all([
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-cream-light border border-charcoal/10 rounded-md w-full max-w-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col transition-all duration-300 transform scale-100 text-charcoal">
        {/* Top Header */}
        <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-cream-dark shrink-0">
          <div>
            <h3 className="font-boska font-bold text-charcoal text-2xl leading-none">
              Think Like a King
            </h3>
            <p className="text-xs text-charcoal/50 mt-1">
              Complete secure checkout
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 p-2 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-cream-dark/50 border-b border-charcoal/10 flex justify-between items-center text-xs shrink-0">
          <div className="flex gap-4 items-center">
            <span className="font-bold uppercase tracking-wider text-accent-gold">
              Digital E-Book Edition
            </span>
          </div>
          <span className="text-charcoal/80 font-mono font-bold">
            Total: $10.00 USD
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm shrink-0 font-bold">
            {error}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-cream-light">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
            <p className="text-gray-600 text-sm italic text-center leading-relaxed mb-2">
              &ldquo;A mind that is not governed will be governed. One way or
              another.&rdquo;
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  disabled={loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                />
              </div>
            </div>

            <div className="mt-4 text-center text-[10px] text-charcoal/45 uppercase tracking-wider">
              Payment processed securely by Stripe.
            </div>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-charcoal/10 bg-cream-dark flex justify-between items-center gap-4 shrink-0">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-5 py-2.5 border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5 font-bold text-xs tracking-wider uppercase rounded-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 bg-accent-gold text-charcoal font-bold text-xs px-6 py-2.5 tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all duration-200 rounded-sm cursor-pointer disabled:opacity-50 min-w-[150px] shadow-xs"
          >
            {loading ? (
              <>
                <Loader2Icon />
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay Securely</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
