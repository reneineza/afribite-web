"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Search, ShoppingCart, Heart, Menu, MenuIcon, ChevronDown, Package, User, LogOut } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const CURRENCIES = ["CAD", "USD"] as const
type Currency = typeof CURRENCIES[number]

const PROMO_TEXT = "Free shipping on orders over $75   ·   Authentic African flavors delivered to your door   ·   Help Center   ·   Track your order     "

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [currency, setCurrency] = useState<Currency>("CAD")

  const items = useCartStore((state) => state.items)
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    setMounted(true)

    const stored = localStorage.getItem("currency") as Currency | null
    if (stored && (CURRENCIES as readonly string[]).includes(stored)) setCurrency(stored as Currency)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`)
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsMobileMenuOpen(false)
    router.refresh()
  }

  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c)
    localStorage.setItem("currency", c)
  }

  const getUserInitials = (u: SupabaseUser) => {
    const name = u.user_metadata?.full_name as string | undefined
    if (name) return name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    return (u.email?.[0] ?? "U").toUpperCase()
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  const navLinkClass = (href: string) =>
    `px-3 text-sm font-bold transition-colors ${
      isActive(href)
        ? "text-secondary border-b-2 border-secondary pb-0.5"
        : "hover:text-secondary"
    }`

  const mobileLinkClass = (href: string) =>
    `transition-colors py-2 ${isActive(href) ? "text-secondary font-bold" : "hover:text-primary"}`

  return (
    <header className={`w-full flex flex-col z-50 sticky top-0 bg-background text-primary transition-shadow duration-200 ${isScrolled ? "shadow-lg" : "shadow-md"}`}>

      {/* 1. TOP BAR — desktop */}
      <div className="text-xs h-9 hidden md:flex items-center justify-between px-6 border-b border-primary/10">
        <div className="font-medium tracking-wide">
          Free shipping on orders over $75 &middot; Authentic African flavors delivered to your door
        </div>
        <div className="flex items-center space-x-6 font-medium">
          <Link href="/contact" className="hover:text-secondary transition-colors">Help Center</Link>
          <Link href="/account/orders" className="hover:text-secondary transition-colors">Order Tracking</Link>
        </div>
      </div>

      {/* 1b. TOP BAR — mobile scrolling ticker */}
      <div className="md:hidden overflow-hidden h-8 bg-primary/5 border-b border-primary/10 flex items-center">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          <span className="text-xs font-medium text-primary/80 px-4">{PROMO_TEXT}</span>
          <span className="text-xs font-medium text-primary/80 px-4" aria-hidden="true">{PROMO_TEXT}</span>
        </div>
      </div>

      {/* 2. MIDDLE BAR */}
      <div className="h-20 flex items-center justify-between px-4 md:px-6">

        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center">
          <div className="md:hidden mr-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger aria-label="Open menu" className="p-1 hover:text-secondary transition-colors text-primary">
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
                    <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/catalog")}>Shop</Link>
                    <Link href="/recipes" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/recipes")}>Recipes</Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/about")}>About Us</Link>
                    <Link href="/wholesale" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/wholesale")}>Wholesale</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass("/contact")}>Contact</Link>

                    <div className="h-px bg-border my-4" />

                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:text-primary transition-colors py-2">
                      <User className="h-5 w-5 mr-3 text-muted-foreground" /> Profile
                    </Link>
                    <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:text-primary transition-colors py-2">
                      <Package className="h-5 w-5 mr-3 text-muted-foreground" /> Orders
                    </Link>
                    <Link href="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:text-primary transition-colors py-2">
                      <Heart className="h-5 w-5 mr-3 text-muted-foreground" /> Wishlist
                    </Link>
                  </nav>
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  {mounted && user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center rounded-md border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                      Login / Register
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center">
            <Image src="/afribite-official.png" alt="AfriBite Logo" width={150} height={40} className="h-8 md:h-10 w-auto object-contain" priority />
          </Link>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full h-10 bg-white border border-primary/20 text-foreground rounded-l-sm pl-4 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center rounded-r-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right: Auth, Wishlist, Cart */}
        <div className="flex items-center space-x-5">
          <div className="hidden md:flex items-center text-sm font-medium">
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 outline-none hover:text-secondary transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {getUserInitials(user)}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {(user.user_metadata?.full_name as string | undefined) ?? user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2 rounded-sm border border-primary/20">
                  <DropdownMenuLabel className="text-xs text-muted-foreground truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/account")} className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account/orders")} className="flex items-center cursor-pointer">
                      <Package className="h-4 w-4 mr-2" /> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account/wishlist")} className="flex items-center cursor-pointer">
                      <Heart className="h-4 w-4 mr-2" /> My Wishlist
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="hover:text-secondary transition-colors text-primary font-bold">Login</Link>
                <span className="mx-2 text-primary/30">|</span>
                <Link href="/signup" className="hover:text-secondary transition-colors text-primary font-bold">Register</Link>
              </>
            )}
          </div>

          <Link href="/account/wishlist" aria-label="Wishlist" className="hidden sm:flex hover:text-secondary transition-colors text-primary">
            <Heart className="h-6 w-6" />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${cartItemCount} item${cartItemCount !== 1 ? "s" : ""}`}
            className="relative hover:text-secondary transition-colors flex items-center text-primary"
          >
            <ShoppingCart className="h-6 w-6" />
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-secondary text-[11px] font-bold text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. BOTTOM BAR — desktop */}
      <div className="h-12 hidden md:flex items-center justify-between px-6 border-t border-primary/10">

        {/* Left: Categories dropdown + Nav */}
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
                <DropdownMenuItem onClick={() => router.push("/categories/spices")} className="cursor-pointer w-full">Spices &amp; Seasonings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/categories/snacks")} className="cursor-pointer w-full">Snacks &amp; Sweets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/categories/staples")} className="cursor-pointer w-full">Pantry Staples</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/categories/beverages")} className="cursor-pointer w-full">Beverages</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex items-center h-full ml-4">
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            <Link href="/catalog" className={navLinkClass("/catalog")}>Shop</Link>
            <Link href="/recipes" className={navLinkClass("/recipes")}>Recipes</Link>
            <Link href="/about" className={navLinkClass("/about")}>About Us</Link>
            <Link href="/wholesale" className={navLinkClass("/wholesale")}>Wholesale</Link>
            <Link href="/contact" className={navLinkClass("/contact")}>Contact</Link>
          </nav>
        </div>

        {/* Right: Currency selector */}
        <div className="flex items-center space-x-3 text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 border border-primary/20 rounded-sm px-2 py-1 cursor-pointer hover:bg-primary/5 transition-colors outline-none">
              <span>{currency}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24 rounded-sm border border-primary/20">
              {CURRENCIES.map((c) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => handleCurrencyChange(c)}
                  className={c === currency ? "font-bold text-primary" : ""}
                >
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-primary/70">Prices in {currency}</span>
        </div>

      </div>
    </header>
  )
}
