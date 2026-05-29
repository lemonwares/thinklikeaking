"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 px-4">
      <div className="bg-[#1A1714] border border-gray-800 rounded-md p-8 md:p-10 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
        
        {/* Cancel Icon */}
        <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <span className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
          Checkout Cancelled
        </span>
        <h2 className="font-germania text-white text-3xl mb-4 leading-tight">
          Purchase Suspended
        </h2>
        
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Your transaction was not completed. No funds have been charged, and your selection remains active. If you experienced technical difficulties or have questions, please reach out to our support team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#C9A84C] text-[#13110e] font-bold text-xs px-6 py-3 tracking-widest uppercase rounded-sm hover:bg-[#b8953f] transition-all duration-200"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-700 text-gray-400 font-semibold text-xs px-6 py-3 tracking-wider uppercase rounded-sm hover:text-white hover:border-gray-600 transition-all duration-200"
          >
            Go Back
          </Link>
        </div>

      </div>
    </div>
  );
}
