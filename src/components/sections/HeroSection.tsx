"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

const SLIDES = [
  {
    id: "suya",
    title: "PREMIUM SUYA SPICE",
    subtitle: "Authentic Nigerian Street Food Flavor",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1920&auto=format&fit=crop",
    href: "/shop?category=spices",
  },
  {
    id: "jollof",
    title: "JOLLOF RICE MIX",
    subtitle: "The Heart of West African Celebrations",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=1920&auto=format&fit=crop",
    href: "/shop?category=grains",
  },
  {
    id: "plantain",
    title: "GOLDEN PLANTAINS",
    subtitle: "Crispy, Sweet, and Perfectly Fried",
    image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1920&auto=format&fit=crop",
    href: "/shop?category=snacks",
  }
]

const SLIDE_DURATION = 6000 // 6 seconds per slide

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [currentIndex]) // Re-run effect when index changes to reset timer

  const activeSlide = SLIDES[currentIndex]

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-end">
      
      {/* 1. Full-Screen Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 w-full h-full container mx-auto px-6 lg:px-12 flex flex-col justify-end pb-12 lg:pb-24 pt-32">
        
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 lg:gap-0 w-full">
          
          {/* Left Side: Large Typography */}
          <div className="lg:w-1/2 flex flex-col items-start text-left z-20 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="max-w-2xl"
              >
                <p className="text-primary font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base drop-shadow-md">
                  {activeSlide.subtitle}
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-8 leading-[1.05] tracking-tight drop-shadow-2xl">
                  {activeSlide.title}
                </h1>
                
                <Link href={activeSlide.href}>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all uppercase tracking-wider text-sm"
                  >
                    Discover Now <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Timed Cards Row */}
          <div className="lg:w-1/2 flex justify-start lg:justify-end items-end gap-4 w-full overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {SLIDES.map((slide, index) => {
              const isActive = index === currentIndex

              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 group overflow-hidden rounded-2xl transition-all duration-700 ease-out text-left border border-white/10 ${
                    isActive ? "w-[240px] h-[160px] md:h-[200px]" : "w-[120px] h-[160px] md:h-[200px] opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* Card Background */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* Active Card Content (Expanded) */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="absolute inset-0 p-4 flex flex-col justify-end"
                    >
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                        {slide.title}
                      </h3>
                    </motion.div>
                  )}

                  {/* The Timed Progress Circle */}
                  <div className={`absolute top-4 right-4 ${isActive ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
                    <div className="relative w-8 h-8 flex items-center justify-center bg-black/50 rounded-full backdrop-blur-md">
                      <Play className="w-3 h-3 text-white ml-0.5" />
                      
                      {/* SVG Ring Animation */}
                      {isActive && (
                        <svg className="absolute inset-0 w-8 h-8 -rotate-90">
                          <circle
                            cx="16"
                            cy="16"
                            r="15"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <motion.circle
                            cx="16"
                            cy="16"
                            r="15"
                            stroke="#ffffff"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="94.2" // 2 * pi * r
                            initial={{ strokeDashoffset: 94.2 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Number Indicator for Inactive Cards */}
                  {!isActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-white/80 font-bold text-xl">0{index + 1}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
