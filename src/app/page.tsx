"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "@/components/CheckoutModal";

const faqs = [
  {
    q: "WHAT IS THE CORE PHILOSOPHY OF 'THINK LIKE A KING'?",
    a: "Unlike conventional self-help that preaches borrowed confidence or blind optimism, 'Think Like a King' outlines a system of self-command. It is a constitution for the self—100 precise rules of thought designed to help you govern your mind and refuse manipulation by external chaos.",
  },
  {
    q: "HOW CAN I BE UPDATED FOR NEW RELEASES OR LECTURES?",
    a: "You can subscribe to our newsletter in the footer below. Subscribed readers receive early-bird copies of essays, private audio commentary from Michael King, and notifications about upcoming seminars and print editions.",
  },
  {
    q: "WILL THERE BE A PRINTED HARDCOVER EDITION?",
    a: "Yes. We are currently preparing a premium hardcover edition bound in fine linen. To be notified immediately when it becomes available, you can subscribe to our newsletter in the footer below.",
  },
  {
    q: "HOW IS THE DIGITAL E-BOOK DELIVERED?",
    a: "Digital editions (E-Books) are delivered instantly to your email inbox immediately after secure checkout. You will receive a link to download the E-Book in all standard formats (EPUB, PDF) compatible with Kindle, iPad, phone, or laptop.",
  },
  {
    q: "HOW SECURE IS THE CHECKOUT PROCESS?",
    a: "Our payments are processed entirely by Stripe, employing AES-256 encryption. We never store your card information. Your secure checkout is completely managed through Stripe's verified merchant portal.",
  },
];

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [initialCheckoutType, setInitialCheckoutType] = useState<
    "ebook" | null
  >(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openCheckout = (
    type: "ebook" | null = null,
  ) => {
    setInitialCheckoutType(type);
    setIsCheckoutOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Entrance animation variants for hero cascade
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemLeft = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } },
  } as const;

  const itemRight = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } },
  } as const;

  const itemCenter = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40 } },
  } as const;

  return (
    <div className="min-h-screen bg-cream-light text-charcoal font-sans selection:bg-accent-gold selection:text-white pb-0 relative">
      {/* Subtle Background Grid Pattern for Premium Editorial Vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-charcoal/10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 max-w-6xl mx-auto"
        >
          {/* Left Column: Author Name, Pill, Column Divider, and Overlapping Mockup */}
          <motion.div
            variants={itemLeft}
            className="lg:col-span-4 flex flex-col justify-between h-full pt-4 relative lg:pr-8 lg:border-r lg:border-charcoal/10"
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-charcoal text-cream-light text-[10px] md:text-xs tracking-[0.25em] font-bold uppercase px-4 py-1.5 rounded-full inline-block shadow-sm">
                  BEST SELLER AUTHOR
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-boska leading-none uppercase text-charcoal tracking-tighter font-extrabold">
                Michael <br />
                King
              </h1>
            </div>

            {/* Book mockup overlapping image */}
            <div
              onClick={() => openCheckout("ebook")}
              className="mt-14 lg:mt-24 relative group cursor-pointer w-full max-w-[290px] self-center lg:self-start"
            >
              <div className="absolute inset-0 bg-accent-gold/10 blur-2xl rounded-lg group-hover:bg-accent-gold/25 transition-all duration-500" />
              <div className="relative border border-charcoal/15 rounded-md overflow-hidden aspect-3/4 bg-cream-dark shadow-2xl group-hover:shadow-[0_25px_60px_rgba(201,168,76,0.25)] transition-all duration-500 transform group-hover:-translate-y-3 group-hover:scale-[1.02]">
                <Image
                  src="/cover_front.png"
                  alt="Think Like a King Book Cover"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent-gold text-charcoal font-bold text-xs uppercase px-5 py-2.5 shadow-lg flex items-center gap-2 rounded-sm group-hover:bg-charcoal group-hover:text-white transition-colors duration-300">
                <span className="tracking-widest">GET EDITION</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Center Column: Portrait Background Frame with Glow and Inner borders */}
          <motion.div
            variants={itemCenter}
            className="lg:col-span-4 flex flex-col items-center relative py-6"
          >
            {/* Glowing Accent behind author */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-gold/15 rounded-full filter blur-3xl pointer-events-none" />

            {/* Double Frame Design */}
            <div className="w-full max-w-[360px] aspect-4/5 relative border border-accent-gold/45 p-2.5 rounded-t-[180px] shadow-sm bg-cream-light/80 z-10">
              <div className="w-full h-full relative bg-[#EAE5DF] rounded-t-[170px] overflow-hidden border border-charcoal/10 shadow-inner">
                <Image
                  src="/author_portrait.png"
                  alt="Michael King Portrait"
                  fill
                  className="object-cover object-center scale-[1.03] hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: New release label, Signature, Text block */}
          <motion.div
            variants={itemRight}
            className="lg:col-span-4 flex flex-col justify-between pt-4 h-full lg:text-right text-left lg:pl-8 lg:border-l lg:border-charcoal/10"
          >
            <div className="flex flex-col lg:items-end items-start">
              <span className="text-accent-gold font-extrabold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2">
                NEW RELEASE
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-boska leading-none italic text-charcoal font-bold">
                Think Like <br className="hidden lg:block" />a King
              </h2>

              {/* Signature Graphic */}
              <div className="mt-5 text-charcoal/50 hover:text-charcoal transition-colors duration-300">
                <svg
                  width="160"
                  height="60"
                  viewBox="0 0 180 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M10,40 C35,10 45,5 55,25 C65,45 50,55 70,35 C95,15 85,25 95,20 C105,15 110,30 115,25 C120,20 125,15 130,22 C135,30 140,25 145,20 C155,10 160,8 170,18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Echoes of Sovereignty Text Card */}
            <div className="mt-14 lg:mt-24 bg-cream-dark/80 border border-charcoal/10 rounded-md p-7 lg:items-end flex flex-col text-left lg:text-right shadow-sm backdrop-blur-xs hover:border-accent-gold/30 transition-colors duration-300">
              <h3 className="font-boska text-2xl mb-4 leading-tight text-charcoal font-bold uppercase tracking-wider">
                Echoes of Sovereignty
              </h3>

              {/* Increased font size for legibility (minimum 15px) */}
              <p className="text-charcoal/80 text-sm md:text-base leading-relaxed max-w-sm mb-6">
                Michael King’s definitive philosophy on independent
                self-command. Discover how to anchor your mindset against
                external opinions, build absolute internal order, and govern
                your decisions like a sovereign ruler.
              </p>

              <button
                onClick={() => {
                  const element = document.getElementById("feature-editions");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-accent-gold hover:text-charcoal transition-colors uppercase tracking-widest cursor-pointer group"
              >
                <span>Read the Doctrine</span>
                <svg
                  className="transform group-hover:translate-y-1 transition-transform duration-300"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bobbing Scroll Down Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-[10px] font-bold tracking-[0.25em] text-charcoal uppercase">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-charcoal flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 rounded-full bg-charcoal" />
          </motion.div>
        </div>
      </section>

      {/* ── 2. PRAISE & PHILOSOPHY BANNER ── */}
      <section className="bg-white py-20 md:py-28 border-y border-charcoal/10 relative z-10">
        <div className="flex flex-col items-center text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-boska tracking-wide text-charcoal uppercase leading-relaxed max-w-5xl font-bold"
          >
            Michael King is a celebrated author whose{" "}
            <span className="bg-charcoal text-white px-6 py-2 rounded-full inline-block mx-2 font-sans font-bold text-lg md:text-2xl align-middle tracking-wider shadow-md select-none border border-white/10 hover:bg-accent-gold hover:text-charcoal transition-all duration-300">
              SOVEREIGN DOCTRINE AND ORDERED THOUGHT
            </span>{" "}
            have summoned readers to inward law.
          </motion.h2>

          {/* Interactive Watch Story Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVideoOpen(true)}
            className="mt-12 md:mt-16 inline-flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full border border-charcoal/20 flex items-center justify-center bg-cream-light group-hover:bg-charcoal group-hover:border-charcoal transition-all duration-300 shadow-md">
              <svg
                className="text-charcoal group-hover:text-white transition-colors translate-x-0.5"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-accent-gold font-bold tracking-[0.25em] uppercase">
                PLAY MESSAGE
              </p>
              <p className="text-xs md:text-sm text-charcoal font-extrabold tracking-widest uppercase mt-0.5">
                WATCH AUTHOR STORY
              </p>
            </div>
          </motion.button>
        </div>
      </section>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full cursor-pointer bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="w-full max-w-4xl aspect-video bg-charcoal border border-white/10 rounded-md overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-linear-to-tr from-charcoal to-charcoal-light">
                <span className="text-accent-gold font-mono text-xs uppercase tracking-[0.3em] mb-4">
                  THINK LIKE A KING
                </span>
                <h3 className="font-boska text-3xl md:text-5xl text-white uppercase mb-2">
                  A Constitution for the Self
                </h3>
                <p className="text-white/60 text-sm md:text-base max-w-md mb-8">
                  &ldquo;A mind that is not governed will be governed. One way
                  or another.&rdquo;
                </p>
                <button
                  onClick={() => {
                    setIsVideoOpen(false);
                    openCheckout(null);
                  }}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-charcoal px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
                >
                  Acquire the Book
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. PUBLISHER LOGOS BANNER ── */}
      <section className="py-12 border-b border-charcoal/10 bg-cream-dark/20 overflow-x-auto relative z-10">
        <div className="flex justify-between items-center gap-8 min-w-[640px] px-4 opacity-60">
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-charcoal text-center flex-1">
            NEW YORK TIMES
          </span>
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-charcoal text-center flex-1">
            REVERE & REGENT
          </span>
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-charcoal text-center flex-1">
            THE SOVEREIGN JOURNAL
          </span>
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-charcoal text-center flex-1">
            PHILOSOPHIA
          </span>
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-charcoal text-center flex-1">
            THE GUARDIAN
          </span>
        </div>
      </section>

      {/* ── 4. FEATURE EDITIONS SECTION ── */}
      <section id="feature-editions" className="py-24 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-accent-gold font-extrabold text-xs md:text-sm tracking-[0.35em] uppercase mb-3">
            Collection
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-boska capitalize tracking-wide text-charcoal font-bold">
            Feature Books
          </h2>
        </div>

        <div className="flex justify-center max-w-md mx-auto px-4">
          {/* Card: Ebook (Highlighted now as it is the only one) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border-2 border-accent-gold rounded-md p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 relative group w-full hover:border-charcoal"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-charcoal/40 text-sm font-bold">
                  01
                </span>
                <span className="text-[10px] md:text-xs bg-accent-gold/15 text-accent-gold px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  Digital Edition
                </span>
              </div>
              <div className="relative aspect-3/4 w-[150px] mx-auto mb-8 bg-white border border-charcoal/10 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/cover_front.png"
                  fill
                  alt="Ebook Cover"
                  className="object-cover scale-95"
                />
              </div>
              <h3 className="text-center font-boska text-2xl md:text-3xl text-charcoal font-bold mb-3">
                Digital E-Book
              </h3>

              {/* Increased size: text-sm md:text-base (15/16px) */}
              <p className="text-center text-charcoal/70 text-sm md:text-base leading-relaxed mb-6 px-2">
                Instant download link sent to your email. Read on Kindle, iPad,
                phone, or laptop. Secures full lifetime access.
              </p>
            </div>
            <div>
              <p className="text-center font-mono font-bold text-xl mb-5 text-charcoal">
                $10.00 <span className="text-[10px] text-charcoal/50">USD</span>
              </p>
              <button
                onClick={() => openCheckout("ebook")}
                className="w-full py-3.5 bg-accent-gold text-charcoal rounded-sm text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all cursor-pointer shadow-md"
              >
                Buy Digital Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. ECHOES OF SOVEREIGNTY COLLAGE (Dark Section) ── */}
      <section className="bg-charcoal text-cream-light py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-5 flex items-center justify-center">
          <span className="text-[10vw] font-boska leading-none uppercase text-white font-extrabold tracking-widest">
            ECHOES OF SILENCE
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="text-accent-gold font-mono text-xs md:text-sm uppercase tracking-[0.25em] mb-3 inline-block">
              Artistic Showcase
            </span>
            <h3 className="font-boska text-3xl md:text-5xl lg:text-6xl capitalize tracking-wide font-bold">
              Refining The Mind
            </h3>
          </div>

          {/* Dynamic Overlapping Book Covers Collage */}
          <div className="flex items-center justify-center w-full min-h-[380px] relative max-w-2xl mt-8">
            {/* Left Cover (Small, offset) */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -12 }}
              whileInView={{ opacity: 0.65, x: -130, rotate: -15 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute w-[160px] md:w-[190px] aspect-3/4 bg-cream-dark border border-white/10 shadow-lg rounded-sm overflow-hidden hidden sm:block z-0"
            >
              <Image
                src="/back_cover.png"
                fill
                alt="Left Book Overlay"
                className="object-cover filter sepia-[0.2]"
              />
            </motion.div>

            {/* Right Cover (Medium, offset, opposite angle) */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 12 }}
              whileInView={{ opacity: 0.75, x: 130, rotate: 10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute w-[180px] md:w-[210px] aspect-3/4 bg-cream-dark border border-white/10 shadow-lg rounded-sm overflow-hidden hidden sm:block z-10"
            >
              <Image
                src="/back_cover.png"
                fill
                alt="Right Book Overlay"
                className="object-cover filter saturate-[0.85]"
              />
            </motion.div>

            {/* Center Cover (Large, centered, vertical focus) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="w-[210px] md:w-[250px] aspect-3/4 bg-cream-dark border-2 border-accent-gold/30 shadow-2xl rounded-sm overflow-hidden relative z-20"
            >
              <Image
                src="/cover_front.png"
                fill
                alt="Center Book Overlay"
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Increased text size to 15/16px */}
          <p className="text-cream-light/75 text-sm md:text-base text-center max-w-md mt-14 leading-relaxed italic">
            &ldquo;The mind that is not governed will be governed. One way or
            another. The only sovereignty of account rests in a mind that
            already governs itself.&rdquo;
          </p>
        </div>
      </section>

      {/* ── 6. ABOUT THE AUTHOR SECTION ── */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left bio column */}
            <div className="lg:col-span-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-accent-gold font-bold text-xs md:text-sm tracking-[0.3em] uppercase mb-3 inline-block">
                  THE AUTHOR
                </span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-boska uppercase tracking-tight text-charcoal mb-8 font-bold">
                  Michael King
                </h2>

                {/* Increased body font sizes to 15/16px */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-charcoal/80 text-sm md:text-base leading-relaxed">
                  <div>
                    <p className="mb-4">
                      Michael King is a contemporary philosopher, educator, and
                      critical thinker focusing on mental sovereignty, stoicism,
                      and intellectual order. He writes for individuals looking
                      to cultivate absolute clarity and conviction amid modern
                      chaos and distractions.
                    </p>
                    <p>
                      Through his work, he challenges standard modern
                      conventions of motivation, offering in their place
                      structured, foundational guidelines—constitutions for
                      self-governance.
                    </p>
                  </div>
                  <div>
                    <p className="mb-4">
                      His publications have touched thousands of readers
                      worldwide, challenging seekers to question borrowed
                      opinions and build intellectual systems rooted in
                      discipline.
                    </p>
                    <p className="font-bold text-charcoal border-accent-gold bg-cream-dark/20 py-2">
                      &ldquo;True strength lies not in loud announcements, but
                      in the ordered silence of a self-commanded
                      intellect.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats/Awards wreaths bar */}
              <div className="mt-14 pt-8 border-t border-charcoal/10 flex flex-wrap gap-8 items-center justify-between opacity-85">
                <div className="flex flex-col items-center text-center">
                  <span className="font-boska text-accent-gold text-2xl md:text-3xl font-extrabold leading-none">
                    2024
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-charcoal/50 mt-1.5">
                    Best Book
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-boska text-accent-gold text-2xl md:text-3xl font-extrabold leading-none">
                    2023
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-charcoal/50 mt-1.5">
                    Best Seller
                  </span>
                </div>
                <div className="w-px h-8 bg-charcoal/15 hidden md:block" />
                <div className="flex flex-col items-center text-center">
                  <span className="font-boska text-accent-gold text-2xl md:text-3xl font-extrabold leading-none">
                    100
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-charcoal/50 mt-1.5">
                    Principles
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-boska text-accent-gold text-2xl md:text-3xl font-extrabold leading-none">
                    4.9★
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-charcoal/50 mt-1.5">
                    Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Right landscape portrait container */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full relative aspect-4/5 bg-cream-dark border border-charcoal/15 rounded-md overflow-hidden shadow-lg mb-4">
                <Image
                  src="/author_landscape.png"
                  fill
                  alt="Michael King in Study"
                  className="object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
              <span className="text-xs text-charcoal/50 uppercase tracking-widest text-center italic">
                Michael King, Study of Philosophy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. QUICK ANSWERS (FAQ) ── */}
      <section className="py-24 bg-cream-dark/40 border-t border-charcoal/10 relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent-gold font-bold text-xs md:text-sm tracking-[0.3em] uppercase mb-3 inline-block">
              COMMON INQUIRIES
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-boska capitalize tracking-wide text-charcoal font-bold">
              Quick Answers
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-charcoal/15">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-6">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left py-2 focus:outline-none group cursor-pointer"
                >
                  {/* FAQ Questions increased size: text-sm md:text-base (15/16px) */}
                  <span className="text-sm md:text-base font-bold text-charcoal group-hover:text-accent-gold transition-colors tracking-wide uppercase">
                    {faq.q}
                  </span>
                  <span className="text-charcoal/60 ml-4 font-mono font-bold text-base md:text-lg">
                    {openFaq === idx ? "—" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* FAQ Answers increased size: text-sm md:text-base (15/16px) */}
                      <p className="pt-3 pb-4 text-charcoal/80 text-sm md:text-base leading-relaxed max-w-[95%]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER SECTION ── */}
      <footer className="bg-charcoal text-cream-light pt-24 pb-10 border-t border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-16">
            {/* Left graphic logo */}
            <div className="md:col-span-5 flex flex-col items-start">
              <div className="relative w-[140px] h-[120px] opacity-25 hover:opacity-45 transition-opacity duration-300 select-none">
                <Image
                  src="/rv_logo.webp"
                  alt="Revere Logo"
                  fill
                  className="object-contain invert"
                />
              </div>
              <p className="text-[10px] md:text-xs text-accent-gold font-bold tracking-[0.3em] uppercase mt-4">
                REVERE & REGENT
              </p>
            </div>

            {/* Right subscription form */}
            <div className="md:col-span-7 w-full flex flex-col items-start md:items-end">
              <div className="w-full max-w-md">
                <span className="text-accent-gold text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-2 inline-block">
                  NEWSLETTER
                </span>
                <h4 className="font-boska text-2xl md:text-3xl uppercase tracking-wide mb-6 font-bold">
                  SUBSCRIBE TO LECTURES
                </h4>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Subscription successful.");
                  }}
                  className="flex border-b border-white/20 pb-2.5 w-full focus-within:border-accent-gold transition-colors duration-300"
                >
                  {/* Inputs font size text-sm md:text-base */}
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL"
                    className="bg-transparent border-none w-full text-sm md:text-base font-bold text-white placeholder-white/30 focus:outline-none tracking-widest uppercase py-2"
                  />
                  <button
                    type="submit"
                    className="text-xs md:text-sm font-bold text-accent-gold hover:text-white transition-colors tracking-widest uppercase cursor-pointer py-2 px-4 whitespace-nowrap"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Lower copyright bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-white/40 tracking-wider">
            <p className="uppercase">
              © {new Date().getFullYear()} Think Like a King. All rights
              reserved.
            </p>
            {/* <div className="flex gap-6 mt-4 sm:mt-0 uppercase">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Use
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div> */}
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        initialType={initialCheckoutType}
      />
    </div>
  );
}
