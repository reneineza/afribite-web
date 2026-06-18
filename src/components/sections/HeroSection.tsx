"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Users, Package } from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────
const ORBIT_ITEMS = [
  {
    id: 1,
    name: "Suya Spice",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300&auto=format&fit=crop",
    slug: "suya-spice",
    angle: 0,
  },
  {
    id: 2,
    name: "Scotch Bonnet",
    price: "$5.49",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300&auto=format&fit=crop",
    slug: "scotch-bonnet",
    angle: 72,
  },
  {
    id: 3,
    name: "Jollof Mix",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=300&auto=format&fit=crop",
    slug: "jollof-mix",
    angle: 144,
  },
  {
    id: 4,
    name: "Plantain",
    price: "$4.99",
    image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=300&auto=format&fit=crop",
    slug: "plantain",
    angle: 216,
  },
  {
    id: 5,
    name: "Plantain Chips",
    price: "$3.99",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=300&auto=format&fit=crop",
    slug: "plantain-chips",
    angle: 288,
  },
]

const STATS = [
  { value: "500+", label: "Products", icon: Package },
  { value: "10K+", label: "Customers", icon: Users },
  { value: "4.9★", label: "Avg Rating", icon: Star },
]

// ─── Word Reveal Animations ──────────────────────────────────────────────────
const wordVariants = {
  hidden: { opacity: 0, y: 35, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use scrollY from framer-motion to track window scroll
  const { scrollY } = useScroll()
  
  // As the user scrolls down 1000px, the orbit rotates 180 degrees
  const rotateOrbit = useTransform(scrollY, [0, 1000], [0, 180])
  // The cards need to counter-rotate to stay upright
  const counterRotate = useTransform(scrollY, [0, 1000], [0, -180])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 80% 50%, #1b3f2a 0%, #0e2018 40%, #080f0b 100%)",
      }}
    >
      {/* ── Background Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M50 50v-8h-4v8h-8v4h8v8h4v-8h8v-4h-8zm0-40V2h-4v8h-8v4h8v8h4V14h8v-4h-8zM10 50v-8H6v8H-2v4h8v8h4v-8h8v-4h-8zM10 10V2H6v8H-2v4h8v8h4V14h8v-4h-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-28 flex flex-col lg:flex-row items-center gap-16">
        
        {/* ── Left Column: Text & CTAs ── */}
        <div className="flex-1 max-w-[600px] lg:max-w-none pt-10">
          <motion.div {...fadeUp(0.2)} className="mb-6">
            <span className="text-sm font-semibold tracking-wider uppercase text-primary">
              Premium Quality Groceries
            </span>
          </motion.div>

          {/* Headline */}
          <div className="mb-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-x-[0.3em] mb-2"
            >
              {["Authentic", "African"].map((word) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  className="text-[clamp(2.8rem,5vw,5rem)] font-extrabold text-white tracking-tight leading-[1.1]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.3 }}
              className="flex flex-wrap gap-x-[0.3em]"
            >
              {["Flavors,"].map((word) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  className="text-[clamp(2.8rem,5vw,5rem)] font-extrabold text-white tracking-tight leading-[1.1]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.5 }}
              className="flex flex-wrap gap-x-[0.3em] mt-2"
            >
              {[
                { word: "Delivered", color: "#ed591f" },
                { word: "to", color: "#C8A45D" },
                { word: "You.", color: "#ed591f" },
              ].map(({ word, color }) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  className="text-[clamp(2.8rem,5vw,5rem)] font-extrabold tracking-tight leading-[1.1]"
                  style={{ color }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.p
            {...fadeUp(0.8)}
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-[500px]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Your premier destination for premium spices, fresh ingredients, and
            authentic African groceries — delivered fast across Canada.
          </motion.p>

          <motion.div {...fadeUp(1.0)} className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link href="/catalog">
              <motion.span
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white cursor-pointer shadow-[0_8px_30px_rgba(237,89,31,0.35)]"
                style={{ background: "linear-gradient(135deg, #ed591f 0%, #b53c0e 100%)" }}
                whileHover={{ scale: 1.05, boxShadow: "0 16px 45px rgba(237,89,31,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                Shop the Catalog
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <Link href="/about">
              <motion.span
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white cursor-pointer border border-white/20 bg-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.97 }}
              >
                Our Story
              </motion.span>
            </Link>
          </motion.div>

          <motion.div {...fadeUp(1.2)} className="flex flex-wrap gap-8">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div key={label} className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10 border border-primary/30">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white leading-none">{value}</p>
                  <p className="text-sm mt-1 text-white/50">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Right Column: 3D Orbit Visual ── */}
        <div className="flex-1 relative w-full aspect-square max-w-[600px] mx-auto lg:mr-0 flex items-center justify-center">
          
          {/* Main Circular Backgrounds (Static) */}
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.85]" />
          <div className="absolute inset-0 rounded-full border border-white/10 scale-[0.6]" />
          
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="absolute w-[45%] h-[45%] rounded-full bg-[#1b3f2a] shadow-[0_0_80px_rgba(237,89,31,0.2)] border border-white/10"
          />

          {/* Central Product Image */}
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring", bounce: 0.4 }}
            className="relative z-20 w-[60%] h-[60%] rounded-full overflow-hidden shadow-2xl"
          >
             <Image 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" 
                alt="Central Product"
                fill
                className="object-cover"
             />
             <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
          </motion.div>

          {/* Rotating Orbit Container */}
          <motion.div
            style={{ rotate: rotateOrbit }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {ORBIT_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  // Position the items in a circle
                  transform: `translate(-50%, -50%) rotate(${item.angle}deg) translateY(-260px)`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1, type: "spring" }}
                >
                  {/* Counter-rotating Wrapper to keep cards upright */}
                <motion.div style={{ rotate: counterRotate }} className="pointer-events-auto">
                  {/* The actual offset to undo the fixed angle rotation so it's upright to start */}
                  <div style={{ transform: `rotate(${-item.angle}deg)` }}>
                    <Link href={`/product/${item.slug}`}>
                      <motion.div 
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="flex items-center gap-4 p-3 pr-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer group"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-base leading-tight">{item.name}</span>
                          <span className="text-primary font-semibold text-sm">{item.price}</span>
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── Bottom fade to site background ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #faf7f2 100%)",
        }}
      />
    </section>
  )
}
