"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Heart, Menu, MenuIcon, ChevronDown, Package, User } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"

// Shadcn UI Components
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Zustand state
  const items = useCartStore((state) => state.items)
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="w-full flex flex-col z-50 sticky top-0 shadow-md bg-background text-primary">
      {/* 1. TOP BAR */}
      <div className="text-xs h-9 hidden md:flex items-center justify-between px-6 border-b border-primary/10">
        <div className="font-medium tracking-wide">
          Get up to 50% off new season styles, limited time only
        </div>
        <div className="flex items-center space-x-6 font-medium">
          <Link href="/contact" className="hover:text-secondary transition-colors">Help Center</Link>
          <Link href="/account/orders" className="hover:text-secondary transition-colors">Order Tracking</Link>
        </div>
      </div>

      {/* 2. MIDDLE BAR */}
      <div className="h-20 flex items-center justify-between px-4 md:px-6">
        
        {/* Left: Logo & Mobile Menu Toggle */}
        <div className="flex items-center">
          <div className="md:hidden mr-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="p-1 hover:text-secondary transition-colors text-primary">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] flex flex-col border-r-0 bg-background text-foreground">
                <SheetHeader className="text-left mb-6 mt-4">
                  <SheetTitle>
                    <Image src="/afribite-official.png" alt="AfriBite Logo" width={120} height={32} className="h-8 w-auto object-contain" />
                  </SheetTitle>
                </SheetHeader>
                
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="h-10 w-full rounded-md border border-input bg-white pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                  <nav className="flex flex-col space-y-4 text-base font-medium">
                    <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">Shop</Link>
                    <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">Categories</Link>
                    <Link href="/recipes" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">Recipes</Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">About Us</Link>
                    <Link href="/wholesale" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">Wholesale</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors py-2">Contact</Link>
                    
                    <div className="h-px bg-border my-4"></div>
                    
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:text-primary transition-colors py-2">
                      <User className="h-5 w-5 mr-3 text-muted-foreground" /> Profile
                    </Link>
                    <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:text-primary transition-colors py-2">
                      <Package className="h-5 w-5 mr-3 text-muted-foreground" /> Orders
                    </Link>
                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:text-primary transition-colors py-2">
                      <Heart className="h-5 w-5 mr-3 text-muted-foreground" /> Wishlist
                    </Link>
                  </nav>
                </div>
                
                <div className="mt-auto pt-6 border-t border-border">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                    Login / Register
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center">
            <Image src="/afribite-official.png" alt="AfriBite Logo" width={150} height={40} className="h-8 md:h-10 w-auto object-contain" priority />
          </Link>
        </div>

        {/* Center: Search Bar (Desktop Only) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative w-full group">
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full h-10 bg-white border border-primary/20 text-foreground rounded-sm pl-4 pr-12 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-primary/70 hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right: Account, Wishlist, Cart */}
        <div className="flex items-center space-x-5">
          <div className="hidden md:flex items-center text-sm font-medium">
            <Link href="/login" className="hover:text-secondary transition-colors text-primary font-bold">Login</Link>
            <span className="mx-2 text-primary/30">|</span>
            <Link href="/login" className="hover:text-secondary transition-colors text-primary font-bold">Register</Link>
          </div>

          <Link href="/wishlist" className="hidden sm:flex hover:text-secondary transition-colors text-primary">
            <Heart className="h-6 w-6" />
          </Link>

          <Link href="/cart" className="relative hover:text-secondary transition-colors flex items-center text-primary">
            <ShoppingCart className="h-6 w-6" />
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-secondary text-[11px] font-bold text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. BOTTOM BAR (Desktop Only) */}
      <div className="h-12 hidden md:flex items-center justify-between px-6 border-t border-primary/10">
        
        {/* Left: Categories Dropdown & Main Nav */}
        <div className="flex items-center h-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-full outline-none transition-colors border-r border-primary/10">
              <MenuIcon className="h-5 w-5" />
              <span className="font-bold text-sm tracking-wide">SHOP BY CATEGORIES</span>
              <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-2 rounded-sm border border-primary/20">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href="/categories/spices" className="w-full">Spices & Seasonings</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/categories/snacks" className="w-full">Snacks & Sweets</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/categories/staples" className="w-full">Pantry Staples</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/categories/beverages" className="w-full">Beverages</Link></DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex items-center h-full ml-4">
            <Link href="/" className="px-3 hover:text-secondary text-sm font-bold transition-colors">Home</Link>
            <Link href="/catalog" className="px-3 hover:text-secondary text-sm font-bold transition-colors">Shop</Link>
            <Link href="/recipes" className="px-3 hover:text-secondary text-sm font-bold transition-colors">Recipes</Link>
            <Link href="/about" className="px-3 hover:text-secondary text-sm font-bold transition-colors">About Us</Link>
            <Link href="/wholesale" className="px-3 hover:text-secondary text-sm font-bold transition-colors">Wholesale</Link>
            <Link href="/contact" className="px-3 hover:text-secondary text-sm font-bold transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Right: Currency / Misc */}
        <div className="flex items-center space-x-4 text-sm font-medium">
          <span className="text-secondary tracking-widest text-lg animate-pulse">🚀</span>
          <div className="flex items-center space-x-1 border border-primary/20 rounded-sm px-2 py-1 cursor-pointer hover:bg-primary/5 transition-colors">
            <span>CAD</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </div>
          <span className="text-primary/70">Prices in CAD</span>
        </div>

      </div>
    </header>
  )
}
