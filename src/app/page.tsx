"use client";

import Image from "next/image";
import { useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";

const features = [
  {
    num: "1",
    title: "Find lion's authority",
    desc: "The difference between borrowed confidence and identity-rooted sovereignty.",
  },
  {
    num: "2",
    title: "Anchor your identity",
    desc: "Build a self that cannot be shaken by circumstance, criticism, or crowd.",
  },
  {
    num: "3",
    title: "Govern your mind",
    desc: "Command your thoughts the way a king commands a kingdom — with order.",
  },
  {
    num: "4",
    title: "Steward provision",
    desc: "Think about wealth, lack, and sufficiency the way builders — not beggars — do.",
  },
  {
    num: "5",
    title: "Speak with authority",
    desc: "Words that govern rooms — not words that seek permission or validation.",
  },
  {
    num: "6",
    title: "Build what endures",
    desc: "Create legacy through principled, sovereign action — not frantic hustle.",
  },
];

const pillars = [
  {
    label: "Self-command",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
      </svg>
    ),
  },
  {
    label: "Disciplined perception",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      </svg>
    ),
  },
  {
    label: "Moral courage",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
  },
  {
    label: "Ordered thought",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [initialCheckoutType, setInitialCheckoutType] = useState<"ebook" | "hardcopy" | null>(null);

  const openCheckout = (type: "ebook" | "hardcopy" | null = null) => {
    setInitialCheckoutType(type);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen py-14 flex flex-col items-center">
      {/* ── HERO ── */}
      <h1 className="font-germania text-5xl text-center">
        The world is not short of problems.
      </h1>
      <h3 className="text-4xl text-gray-500 font-germania text-center mt-2">
        It is short of governed minds.
      </h3>

      {/* ── BOOK IMAGE ── */}
      <div className="h-[550px] border border-gray-300 rounded-md mt-12 w-[80%] max-md:w-[95%] overflow-hidden relative">
        <Image
          src="/book.webp"
          alt="Think Like a King — Book Cover"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* ── MAIN DARK CARD ── */}
      <div className="w-[80%] border border-gray-300 mt-6 p-8 bg-[#1A1714] rounded-md max-md:w-[95%] flex flex-col items-center">
        <div className="w-[70%] max-md:w-full flex flex-col items-center">
          <h2 className="font-germania text-white mt-2 text-5xl text-center leading-tight">
            This is not a book about thinking positively. It is a book about
            thinking sovereignly.
          </h2>
          <p className="italic mt-3 text-[#C9A84C] text-sm text-center">
            There is a difference. And that difference is everything.
          </p>

          <hr className="w-full border-gray-700 my-8" />

          <div className="flex flex-col items-center gap-1 text-gray-400 text-sm text-center">
            <p>Most books tell you to follow more.</p>
            <p>To hustle harder. To visualise success.</p>
            <p>To master your morning routine.</p>
            <p className="mt-5 text-gray-300">This book does none of that.</p>
          </div>

          <p className="mt-6 text-gray-300 text-sm text-center leading-relaxed">
            <span className="font-bold text-white">Think Like a King</span>{" "}
            gives you a governing rule — one hundred precise distinctions
            between the thinking that keeps you ruled and the thinking that sets
            you free.
          </p>

          <hr className="w-full border-gray-700 my-8" />

          <div className="flex flex-col items-center gap-1 text-white text-xl italic">
            <p>Not motivation.</p>
            <p>Not affirmation.</p>
            <p>Not a system.</p>
            <p className="text-[#C9A84C] not-italic font-semibold text-base mt-2 tracking-wide">
              A constitution for the self.
            </p>
          </div>

          <hr className="w-full border-gray-700 my-8" />
        </div>

        {/* ── FEATURE CARDS ── */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div
              key={f.num}
              className="border border-gray-700 rounded-md p-5 flex flex-col gap-2 hover:border-[#C9A84C]/40 transition-colors duration-200"
            >
              <span className="text-[#C9A84C] text-xs font-bold">{f.num}.</span>
              <h4 className="text-white text-sm font-semibold leading-snug">
                {f.title}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── THE NEW MIND (inner card) ── */}
        <div className="w-full mt-6 bg-[#0F0D0B] border border-gray-800 rounded-md p-8 flex flex-col items-start">
          <span className="text-[#C9A84C] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            The New Mind
          </span>
          <div className="flex flex-col gap-1 text-gray-400 text-sm italic">
            <p>There is a voice that seeks to govern you.</p>
            <p>Not through silence. Not through force.</p>
            <p className="text-white not-italic font-semibold mt-2">
              Through conviction.
            </p>
            <p className="mt-4">All discourse feigned your submission.</p>
            <p>It allows you to make your decisions for you.</p>
            <p>To name what you sense. Shape what you think.</p>
            <p>To refuse what you want before you know you want it.</p>
          </div>
          <div className="flex flex-col gap-0 text-gray-400 text-sm italic mt-4">
            <p>The mind that is not governed</p>
            <p>will be governed.</p>
            <p>One way or another.</p>
          </div>
          <p className="mt-6 text-white font-bold text-sm not-italic leading-snug">
            The only sovereignty of account rests
            <br />
            in a mind that already governs itself.
          </p>
        </div>

        {/* ── ONE HUNDRED PRINCIPLES ── */}
        <div className="w-[70%] max-md:w-full flex flex-col items-center mt-10 text-center">
          <p className="font-germania text-white text-3xl md:text-4xl">
            One hundred principles.
          </p>
          <p className="font-germania text-white text-3xl md:text-4xl mt-1">
            Seven governing doctrines.
          </p>
          <p className="font-germania text-[#C9A84C] text-3xl md:text-4xl mt-1">
            One code that cannot be taken.
          </p>
          <button
            id="reign-now-btn"
            onClick={() => openCheckout(null)}
            className="mt-8 inline-flex items-center justify-center border border-gray-600 text-gray-300 font-semibold text-xs px-10 py-3 tracking-[0.15em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-200 cursor-pointer"
          >
            Reign Now
          </button>
        </div>
      </div>

      {/* ── BUY THE BOOK ── */}
      <div
        id="buy"
        className="w-[80%] max-md:w-[90%] mt-8 flex flex-col items-center text-center"
      >
        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mb-1">
          Buy the Book
        </p>
        <p className="text-gray-400 text-sm italic mb-5">
          Rule yourself. Rule your mind.
        </p>
        <button
          id="buy-book-btn"
          onClick={() => openCheckout(null)}
          className="inline-flex items-center justify-center bg-[#C9A84C] text-[#13110e] font-bold text-sm px-10 py-3.5 tracking-wide hover:bg-[#b8953f] transition-colors duration-200 rounded-sm cursor-pointer"
        >
          Buy the Book
        </button>
      </div>

      {/* ── 4 PILLARS ── */}
      <div className="w-[80%] max-md:w-[90%] mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {pillars.map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="text-gray-400">{p.icon}</div>
            <p className="text-sm text-gray-600 font-semibold">{p.label}</p>
          </div>
        ))}
      </div>

      {/* ── TESTIMONIAL / ENDORSEMENT ── */}
      <div className="w-[80%] max-md:w-[90%] mt-14 flex flex-col items-start">
        <blockquote className="text-gray-900 text-xl md:text-2xl font-germania leading-snug max-w-xl">
          In a world of chaos, distraction <br /> and disorder, Think Like a
          King summons readers to inward <br /> law and sovereign clarity.{" "}
          <br />
          <span className="text-[#C9A84C]">
            A grave and vital philosophy for this age.
          </span>
        </blockquote>
        <p className="mt-4 text-gray-400 text-xs tracking-widest uppercase">
          BRA.
        </p>
      </div>

      {/* ── AUTHOR ── */}
      <div className="w-[80%] max-md:w-[90%] mt-14 border border-gray-200 rounded-md p-8 flex flex-col md:flex-row gap-8">
        {/* Author info */}
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <p className="font-germania text-2xl text-gray-900">Michael King</p>
            <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
              Author
            </p>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Michael King is a philosopher who explores self-mastery,
            sovereignty, and moral order. His writing challenges readers toward
            governed and disciplined thought — the kind that builds, leads, and
            endures.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            He writes for those who seek true clarity and resolve over
            counterfeit confidence.
          </p>
          <button
            id="author-buy-btn"
            onClick={() => openCheckout(null)}
            className="self-start mt-2 inline-flex items-center justify-center bg-[#C9A84C] text-[#13110e] font-bold text-xs px-6 py-2.5 tracking-wide hover:bg-[#b8953f] transition-colors duration-200 rounded-sm cursor-pointer"
          >
            Buy the Book
          </button>

          {/* Categories + meta */}
          <div className="flex flex-col gap-1 mt-2">
            {["Sovereign Thought", "Philosophy", "Education"].map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-2 text-xs text-gray-400"
              >
                <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                {cat}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>4 min</span>
            <span>·</span>
            <span>0 Pages resource</span>
          </div>
        </div>

        {/* Author photo placeholder */}
        <div className="w-full md:w-48 h-48 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-gray-300 text-xs shrink-0">
          Author photo
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-[80%] max-md:w-[90%] mt-16 pt-8 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
        <p className="font-germania text-sm text-gray-500">
          Revere &amp; Regent
        </p>
        <p>© {new Date().getFullYear()} Think Like a King</p>
      </footer>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        initialType={initialCheckoutType}
      />
    </div>
  );
}
