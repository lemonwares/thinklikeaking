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
  const [selectedType, setSelectedType] = useState<"ebook" | "hardcopy" | "bundle" | null>(
    initialType,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  // Sync state when modal opens or initialType changes
  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setSelectedType(initialType);
        setStep(2);
      } else {
        setSelectedType(null);
        setStep(1);
      }
      setError(null);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const getPrice = () => {
    if (selectedType === "ebook") return "$10.00";
    if (selectedType === "hardcopy") return "$25.00";
    if (selectedType === "bundle") return "$30.00";
    return "";
  };

  const handleNext = () => {
    if (!selectedType) {
      setError("Please select an edition first.");
      return;
    }
    setError(null);
    setIsTransitioning(true);

    // Aesthetics delay of exactly 1.5 seconds
    setTimeout(() => {
      setIsTransitioning(false);
      setStep(2);
    }, 1500);
  };

  const handleBack = () => {
    // If the modal was opened with a pre-selected type, clicking "Back" should close the modal rather than going to Step 1
    if (initialType) {
      onClose();
    } else {
      setError(null);
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Please enter your name and email.");
      return;
    }

    if (selectedType === "hardcopy" || selectedType === "bundle") {
      if (
        !address.line1 ||
        !address.city ||
        !address.postalCode ||
        !address.country
      ) {
        setError("Please fill out all required shipping fields.");
        return;
      }
    }

    setLoading(true);
    try {
      let endpoint = "";
      if (selectedType === "ebook") endpoint = "/api/checkout/ebook";
      else if (selectedType === "hardcopy") endpoint = "/api/checkout/hardcopy";
      else if (selectedType === "bundle") endpoint = "/api/checkout/bundle";

      const payload =
        selectedType === "ebook" ? { name, email } : { name, email, address };

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
        onClick={loading || isTransitioning ? undefined : onClose}
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
              {step === 1 ? "Select your edition & checkout" : "Complete secure billing and delivery"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading || isTransitioning}
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
            <span
              className={`font-bold uppercase tracking-wider ${step === 1 ? "text-accent-gold" : "text-charcoal/40"}`}
            >
              1. Choose Edition
            </span>
            <span className="text-charcoal/20">/</span>
            <span
              className={`font-bold uppercase tracking-wider ${step === 2 ? "text-accent-gold" : "text-charcoal/40"}`}
            >
              2. Secure Details
            </span>
          </div>
          {selectedType && (
            <span className="text-charcoal/80 font-mono font-bold">
              Total: {getPrice()}
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm shrink-0 font-bold">
            {error}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-cream-light">
          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <p className="text-gray-600 text-sm italic text-center leading-relaxed">
                &ldquo;A mind that is not governed will be governed. One way or
                another.&rdquo;
              </p>

              {/* Vertical list of options for better balance and descriptive flow */}
              <div className="flex flex-col gap-4">
                {/* EBOOK Option */}
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    setSelectedType("ebook");
                    setError(null);
                  }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between text-left p-5 border rounded-md transition-all duration-300 cursor-pointer disabled:opacity-80 gap-4 ${
                    selectedType === "ebook"
                      ? "bg-accent-gold/5 border-accent-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                      : "bg-white border-charcoal/10 hover:border-charcoal/30 hover:bg-cream-dark/30"
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-accent-gold text-[10px] font-bold tracking-wider uppercase mb-1 block">
                      Digital Edition
                    </span>
                    <h4 className="font-boska font-bold text-charcoal text-lg">E-Book</h4>
                    <p className="text-charcoal/60 text-xs mt-1 leading-relaxed">
                      Read instantly on Kindle, iPad, or phone. secure download link sent to your email.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1 self-start sm:self-center shrink-0">
                    <span className="text-charcoal font-bold font-mono text-lg">$10.00</span>
                    <span className="text-charcoal/40 text-[10px]">USD</span>
                  </div>
                </button>

                {/* HARDCOPY Option */}
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    setSelectedType("hardcopy");
                    setError(null);
                  }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between text-left p-5 border rounded-md transition-all duration-300 cursor-pointer disabled:opacity-80 gap-4 ${
                    selectedType === "hardcopy"
                      ? "bg-accent-gold/5 border-accent-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                      : "bg-white border-charcoal/10 hover:border-charcoal/30 hover:bg-cream-dark/30"
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-accent-gold text-[10px] font-bold tracking-wider uppercase mb-1 block">
                      Printed Edition
                    </span>
                    <h4 className="font-boska font-bold text-charcoal text-lg">Hardcover</h4>
                    <p className="text-charcoal/60 text-xs mt-1 leading-relaxed">
                      Linen hardcover with gold foil stamping shipped to your door. Tracking links included.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1 self-start sm:self-center shrink-0">
                    <span className="text-charcoal font-bold font-mono text-lg">$25.00</span>
                    <span className="text-charcoal/40 text-[10px]">USD</span>
                  </div>
                </button>

                {/* BUNDLE Option */}
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    setSelectedType("bundle");
                    setError(null);
                  }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between text-left p-5 border rounded-md transition-all duration-300 cursor-pointer disabled:opacity-80 gap-4 ${
                    selectedType === "bundle"
                      ? "bg-accent-gold/5 border-accent-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                      : "bg-white border-charcoal/10 hover:border-charcoal/30 hover:bg-cream-dark/30"
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-accent-gold text-[10px] font-bold tracking-wider uppercase mb-1 block">
                      Ultimate Edition
                    </span>
                    <h4 className="font-boska font-bold text-charcoal text-lg">Sovereign Bundle</h4>
                    <p className="text-charcoal/60 text-xs mt-1 leading-relaxed">
                      Get the instant E-Book today plus the linen print Hardcover shipped right to your door.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1 self-start sm:self-center shrink-0">
                    <span className="text-charcoal font-bold font-mono text-lg">$30.00</span>
                    <span className="text-charcoal/40 text-[10px]">USD</span>
                  </div>
                </button>
              </div>

              <div className="mt-2 text-center text-[10px] text-charcoal/45 uppercase tracking-wider">
                Payment processed securely by Stripe.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {(selectedType === "hardcopy" || selectedType === "bundle") && (
                <div className="border-t border-charcoal/10 pt-4 mt-2 flex flex-col gap-3">
                  <span className="text-xs font-bold text-accent-gold tracking-wide uppercase">
                    Shipping Destination
                  </span>

                  <div>
                    <label
                      htmlFor="checkout-street"
                      className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                    >
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-street"
                      type="text"
                      required
                      disabled={loading}
                      value={address.line1}
                      onChange={(e) =>
                        setAddress({ ...address, line1: e.target.value })
                      }
                      placeholder="123 Sovereign Way"
                      className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-suite"
                      className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                    >
                      Apartment, Suite, Unit, etc.
                    </label>
                    <input
                      id="checkout-suite"
                      type="text"
                      disabled={loading}
                      value={address.line2}
                      onChange={(e) =>
                        setAddress({ ...address, line2: e.target.value })
                      }
                      placeholder="Apt 4B (Optional)"
                      className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="checkout-city"
                        className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        disabled={loading}
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        placeholder="City"
                        className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-state"
                        className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                      >
                        State / Province
                      </label>
                      <input
                        id="checkout-state"
                        type="text"
                        disabled={loading}
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        placeholder="State"
                        className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="checkout-zip"
                        className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                      >
                        Zip / Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-zip"
                        type="text"
                        required
                        disabled={loading}
                        value={address.postalCode}
                        onChange={(e) =>
                          setAddress({ ...address, postalCode: e.target.value })
                        }
                        placeholder="10001"
                        className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-country"
                        className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-wider mb-1.5"
                      >
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="checkout-country"
                        required
                        disabled={loading}
                        value={address.country}
                        onChange={(e) =>
                          setAddress({ ...address, country: e.target.value })
                        }
                        className="w-full bg-white border border-charcoal/15 focus:border-accent-gold rounded-sm px-3.5 py-2.5 text-sm text-charcoal focus:outline-none transition-colors focus:ring-1 focus:ring-accent-gold cursor-pointer"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="NG">Nigeria</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-charcoal/10 bg-cream-dark flex justify-between items-center gap-4 shrink-0">
          <button
            type="button"
            disabled={loading || isTransitioning}
            onClick={handleBack}
            className="px-5 py-2.5 border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5 font-bold text-xs tracking-wider uppercase rounded-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {initialType ? "Cancel" : step === 2 ? "Back" : "Cancel"}
          </button>

          {step === 1 ? (
            <button
              type="button"
              disabled={isTransitioning}
              onClick={handleNext}
              className="flex items-center justify-center gap-2 bg-accent-gold text-charcoal font-bold text-xs px-6 py-2.5 tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all duration-200 rounded-sm cursor-pointer shadow-xs min-w-[120px] disabled:opacity-50"
            >
              {isTransitioning ? (
                <>
                  <Loader2Icon />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || isTransitioning}
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
          )}
        </div>
      </div>
    </div>
  );
}
