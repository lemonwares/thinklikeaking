"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderStatus {
  status: "PENDING" | "COMPLETE";
  type?: "EBOOK" | "HARDCOPY";
  name?: string;
  email?: string;
  downloadToken?: string | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    let intervalId: NodeJS.Timeout;
    let attemptCount = 0;
    const MAX_ATTEMPTS = 20; // 30s total

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/order/status?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Failed to load");
        const data: OrderStatus = await res.json();

        setOrder(data);
        attemptCount += 1;
        setAttempts(attemptCount);

        // Stop polling once complete or after max attempts
        if (data.status === "COMPLETE" || attemptCount >= MAX_ATTEMPTS) {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 1.5s
    intervalId = setInterval(checkStatus, 1500);

    return () => clearInterval(intervalId);
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="font-germania text-3xl text-red-500 mb-4">Invalid Session</h2>
        <p className="text-gray-400 text-sm mb-6">We could not locate this checkout session.</p>
        <Link href="/" className="inline-flex items-center justify-center bg-[#C9A84C] text-[#13110e] font-bold text-xs px-6 py-2.5 tracking-wider uppercase rounded-sm hover:bg-[#b8953f] transition-all duration-200">
          Go to Home
        </Link>
      </div>
    );
  }

  // 1. Webhook is still processing or order hasn't loaded yet
  if (!order || order.status === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
        {/* Loading Spinner */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#C9A84C] animate-spin" />
        </div>
        <h2 className="font-germania text-white text-3xl mb-2">Securing Your Order...</h2>
        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
          Stripe has verified payment. We are generating your secure download credentials and finalizing printing orders...
        </p>
      </div>
    );
  }

  // 2. Fulfillment complete
  const isEbook = order.type === "EBOOK";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 px-4">
      <div className="bg-[#1A1714] border border-[#C9A84C]/25 rounded-md p-8 md:p-10 max-w-xl w-full text-center shadow-2xl flex flex-col items-center">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C] mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span className="text-[#C9A84C] text-xs font-bold tracking-[0.2em] uppercase mb-2">
          Order Confirmed
        </span>
        <h2 className="font-germania text-white text-4xl mb-4 leading-tight">
          Welcome to the Sovereignty, {order.name}
        </h2>
        
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Your transaction was successful. A copy of your invoice and order summary has been emailed to <span className="text-white font-medium">{order.email}</span>.
        </p>

        {isEbook ? (
          <div className="w-full bg-[#0F0D0B] border border-gray-800 rounded-md p-6 mb-8 flex flex-col items-center">
            <h4 className="font-semibold text-white text-sm mb-2">Your Copy is Ready</h4>
            <p className="text-xs text-gray-500 mb-5 max-w-xs">
              Click the button below to download the book instantly. This link is secure and will expire in 48 hours.
            </p>
            {order.downloadToken ? (
              <a
                href={`/api/download/${order.downloadToken}`}
                className="w-full inline-flex items-center justify-center bg-[#C9A84C] text-[#13110e] font-bold text-xs px-8 py-3.5 tracking-widest uppercase rounded-sm hover:bg-[#b8953f] transition-all duration-200"
              >
                Download E-Book
              </a>
            ) : (
              <div className="text-xs text-red-400 font-medium">
                Generating download token... Check your email shortly.
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-[#0F0D0B] border border-gray-800 rounded-md p-6 mb-8 flex flex-col items-start text-left">
            <span className="text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase mb-2 block">
              Fulfillment Status
            </span>
            <h4 className="font-semibold text-white text-sm mb-2">Hardcover Printed Edition</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Your order is queued in our print-on-demand warehouse. As soon as the binding is completed and standard courier pickup occurs, we will send an automatic email notification with your tracking details.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-900/50 border border-gray-800 px-3 py-1.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              QUEUED FOR FULFILLMENT
            </div>
          </div>
        )}

        <Link
          href="/"
          className="text-gray-400 hover:text-white text-xs font-semibold tracking-wider uppercase border-b border-gray-700 hover:border-white transition-all duration-200 pb-1"
        >
          Return to Sovereign Thought
        </Link>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#C9A84C] animate-spin" />
        </div>
        <h2 className="font-germania text-white text-3xl mb-2">Loading Session Details...</h2>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
