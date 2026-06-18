"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Leaf, Truck, ShieldCheck, Globe, Star, Zap } from "lucide-react"

const BENEFITS = [
  {
    icon: Leaf,
    title: "Authentic Sourcing",
    description:
      "Every product is hand-selected and sourced directly from across Africa — guaranteeing authentic flavours you can't find elsewhere.",
    stat: "100%",
    statLabel: "Direct Import",
    gradient: "from-emerald-500/20 via-green-400/10 to-transparent",
    glow: "rgba(52,211,153,0.15)",
    iconColor: "#34d399",
    accent: "#214e3a",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description:
      "Reliable, trackable delivery across Canada. Orders over $75 ship free — from our warehouse to your door in days.",
    stat: "2–5",
    statLabel: "Day Delivery",
    gradient: "from-orange-500/20 via-amber-400/10 to-transparent",
    glow: "rgba(237,89,31,0.15)",
    iconColor: "#ed591f",
    accent: "#ed591f",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description:
      "Not happy? We'll make it right. Every order is backed by our 100% satisfaction promise — no questions asked.",
    stat: "100%",
    statLabel: "Satisfaction",
    gradient: "from-amber-400/20 via-yellow-300/10 to-transparent",
    glow: "rgba(200,164,93,0.15)",
    iconColor: "#C8A45D",
    accent: "#C8A45D",
  },
]

const TRUST_BADGES = [
  { icon: Globe, label: "Ships Canada-Wide" },
  { icon: Star, label: "4.9★ Customer Rating" },
  { icon: Zap, label: "Same-Day Processing" },
]

// Card component
function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof BENEFITS)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = benefit.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative rounded-3xl p-8 overflow-hidden border cursor-default"
      style={{
        background: "rgba(255,255,255,0.6)",
        borderColor: "rgba(33,78,58,0.1)",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.8) inset",
      }}
    >
      {/* Gradient bg */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Glow blob */}
      <motion.div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${benefit.glow} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stat badge — top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
        className="absolute top-6 right-6 text-right"
      >
        <p
          className="text-2xl font-extrabold leading-none"
          style={{ color: benefit.iconColor }}
        >
          {benefit.stat}
        </p>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {benefit.statLabel}
        </p>
      </motion.div>

      {/* Icon */}
      <div
        className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: `${benefit.glow}`,
          border: `1px solid ${benefit.iconColor}30`,
          boxShadow: `0 8px 24px ${benefit.glow}`,
        }}
      >
        <Icon className="w-7 h-7" style={{ color: benefit.iconColor }} />
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h3 className="text-xl font-extrabold text-foreground mb-3 group-hover:text-foreground transition-colors">
          {benefit.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {benefit.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[3px] rounded-b-3xl"
        style={{ background: `linear-gradient(to right, ${benefit.iconColor}, transparent)` }}
        initial={{ width: "0%" }}
        animate={inView ? { width: "60%" } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.4, ease: "easeOut" }}
      />
    </motion.div>
  )
}

// Main export
export function BenefitsSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: "-40px" })
  const badgesRef = useRef<HTMLDivElement>(null)
  const badgesInView = useInView(badgesRef, { once: true, margin: "-40px" })

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "#faf7f2" }}>
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #214e3a 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top divider glow */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(33,78,58,0.3) 30%, rgba(237,89,31,0.3) 70%, transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* Section heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full border"
            style={{
              color: "#ed591f",
              borderColor: "rgba(237,89,31,0.25)",
              background: "rgba(237,89,31,0.07)",
            }}
          >
            Why Choose AfriBite
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            The AfriBite{" "}
            <span style={{ color: "#214e3a" }}>Promise</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            We hold ourselves to the highest standard — so every order feels like it came straight from home.
          </p>
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={i} />
          ))}
        </div>

        {/* Trust badges strip */}
        <motion.div
          ref={badgesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={badgesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {TRUST_BADGES.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={badgesInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-sm font-semibold"
              style={{
                borderColor: "rgba(33,78,58,0.18)",
                background: "rgba(255,255,255,0.7)",
                color: "#214e3a",
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon className="w-4 h-4" style={{ color: "#ed591f" }} />
              {label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
