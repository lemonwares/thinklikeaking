"use client";

import { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "ebook" | "hardcopy" | null;
}

// Elegant Loader2 component (matches Lucide Loader2 exactly with zero package footprint)
function Loader2Icon({ className = "animate-spin h-4 w-4" }: { className?: string }) {
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

export default function CheckoutModal({ isOpen, onClose, initialType = null }: CheckoutModalProps) {
  const [selectedType, setSelectedType] = useState<"ebook" | "hardcopy" | null>(initialType);
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

  if (!isOpen) return null;

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
    setError(null);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email) {
      setError("Please enter your name and email.");
      return;
    }

    if (selectedType === "hardcopy") {
      if (!address.line1 || !address.city || !address.postalCode || !address.country) {
        setError("Please fill out all required shipping fields.");
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = selectedType === "ebook" ? "/api/checkout/ebook" : "/api/checkout/hardcopy";
      const payload =
        selectedType === "ebook"
          ? { name, email }
          : { name, email, address };

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
      setError(err.message || "An unexpected error occurred. Please try again.");
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
      <div className="relative bg-white border border-gray-200 rounded-md w-full max-w-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col transition-all duration-300 transform scale-100">
        
        {/* Top Header */}
        <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h3 className="font-germania text-gray-900 text-2xl leading-none">Think Like a King</h3>
            <p className="text-xs text-gray-500 mt-1">Select your edition & checkout</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading || isTransitioning}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-150 p-2 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-150 flex justify-between items-center text-xs shrink-0">
          <div className="flex gap-4 items-center">
            <span className={`font-semibold ${step === 1 ? "text-[#C9A84C]" : "text-gray-400"}`}>
              1. Choose Edition
            </span>
            <span className="text-gray-300">/</span>
            <span className={`font-semibold ${step === 2 ? "text-[#C9A84C]" : "text-gray-400"}`}>
              2. Secure Details
            </span>
          </div>
          {selectedType && (
            <span className="text-gray-600 font-medium">
              Total: {selectedType === "ebook" ? "$10.00" : "$25.00"}
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm shrink-0">
            {error}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <p className="text-gray-600 text-sm italic text-center leading-relaxed">
                &ldquo;A mind that is not governed will be governed. One way or another.&rdquo;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* EBOOK Option */}
                <button
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    setSelectedType("ebook");
                    setError(null);
                  }}
                  className={`flex flex-col items-start text-left p-5 border rounded-md transition-all duration-300 cursor-pointer disabled:opacity-80 ${
                    selectedType === "ebook"
                      ? "bg-[#C9A84C]/5 border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <span className="text-[#C9A84C] text-xs font-bold tracking-wider uppercase mb-1">
                    Digital Edition
                  </span>
                  <h4 className="font-germania text-gray-900 text-xl">E-Book</h4>
                  <p className="text-gray-550 text-xs mt-2 flex-1 leading-relaxed">
                    Read instantly on any phone, tablet, or Kindle. Token-secured download sent directly to your email.
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-gray-950 text-lg font-bold font-mono">$10.00</span>
                    <span className="text-gray-400 text-[10px]">USD</span>
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
                  className={`flex flex-col items-start text-left p-5 border rounded-md transition-all duration-300 cursor-pointer disabled:opacity-80 ${
                    selectedType === "hardcopy"
                      ? "bg-[#C9A84C]/5 border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <span className="text-[#C9A84C] text-xs font-bold tracking-wider uppercase mb-1">
                    Printed Edition
                  </span>
                  <h4 className="font-germania text-gray-900 text-xl">Hardcover</h4>
                  <p className="text-gray-550 text-xs mt-2 flex-1 leading-relaxed">
                    Premium hardcover linen book shipped right to your door. Dynamic global order tracking links included.
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-gray-950 text-lg font-bold font-mono">$25.00</span>
                    <span className="text-gray-400 text-[10px]">USD</span>
                  </div>
                </button>
              </div>

              <div className="mt-2 text-center text-[10px] text-gray-400">
                Payment processed securely by Stripe. Instant delivery.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
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
                    className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
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
                    className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                  />
                </div>
              </div>

              {selectedType === "hardcopy" && (
                <div className="border-t border-gray-150 pt-4 mt-2 flex flex-col gap-3">
                  <span className="text-xs font-bold text-[#C9A84C] tracking-wide">
                    Shipping Destination
                  </span>
                  
                  <div>
                    <label htmlFor="checkout-street" className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-street"
                      type="text"
                      required
                      disabled={loading}
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      placeholder="123 Sovereign Way"
                      className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-suite" className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Apartment, Suite, Unit, etc.
                    </label>
                    <input
                      id="checkout-suite"
                      type="text"
                      disabled={loading}
                      value={address.line2}
                      onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      placeholder="Apt 4B (Optional)"
                      className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkout-city" className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        disabled={loading}
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="City"
                        className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-state" className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        State / Province
                      </label>
                      <input
                        id="checkout-state"
                        type="text"
                        disabled={loading}
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        placeholder="State"
                        className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkout-zip" className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Zip / Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-zip"
                        type="text"
                        required
                        disabled={loading}
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        placeholder="10001"
                        className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-country" className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="checkout-country"
                        required
                        disabled={loading}
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        className="w-full bg-white border border-gray-300 focus:border-[#C9A84C] rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none transition-colors focus:ring-1 focus:ring-[#C9A84C]"
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
        <div className="p-6 border-t border-gray-150 bg-gray-50 flex justify-between items-center gap-4 shrink-0">
          {step === 2 ? (
            <button
              type="button"
              disabled={loading || isTransitioning}
              onClick={handleBack}
              className="px-5 py-2.5 border border-gray-300 text-gray-650 hover:text-gray-900 hover:border-gray-400 font-semibold text-xs tracking-wider uppercase rounded-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || isTransitioning}
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-650 hover:text-gray-900 hover:border-gray-400 font-semibold text-xs tracking-wider uppercase rounded-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              disabled={isTransitioning}
              onClick={handleNext}
              className="flex items-center justify-center gap-2 bg-[#C9A84C] text-[#13110e] font-bold text-xs px-6 py-2.5 tracking-widest uppercase hover:bg-[#b8953f] transition-all duration-200 rounded-sm cursor-pointer shadow-xs min-w-[120px] disabled:opacity-50"
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
              className="flex items-center justify-center gap-2 bg-[#C9A84C] text-[#13110e] font-bold text-xs px-6 py-2.5 tracking-widest uppercase hover:bg-[#b8953f] transition-all duration-200 rounded-sm cursor-pointer disabled:opacity-50 min-w-[150px] shadow-xs"
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
