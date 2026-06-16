import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShieldCheck, Truck, Leaf, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/common/ProductCard'
import { createClient } from '@/lib/supabase/server'

// Mock Data
const categories = [
  { name: 'Spices & Seasonings', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { name: 'Grains & Flours', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=600&auto=format&fit=crop' },
  { name: 'Snacks & Beverages', image: 'https://images.unsplash.com/photo-1621245464303-125439a03975?q=80&w=600&auto=format&fit=crop' }
]

export default async function Home() {
  const supabase = await createClient()
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(4)
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2000&auto=format&fit=crop" 
            alt="African Food Ingredients" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16 animate-fade-in">
          <Badge className="mb-6 bg-primary/20 text-primary-foreground hover:bg-primary/30 text-sm px-4 py-1 border border-primary/50 backdrop-blur-md">
            Now Shipping Across Canada 🇨🇦
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            Authentic African Flavors, <br />
            <span className="text-primary">Delivered to You.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl drop-shadow-md">
            Your premier destination for premium spices, fresh ingredients, and authentic African groceries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/catalog" className={cn(buttonVariants({ size: "lg" }), "text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:scale-105 transition-transform")}>
              Shop the Catalog <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-lg px-8 py-6 h-auto border-white text-white hover:bg-white/20 backdrop-blur-sm")}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center p-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Authentic Sourcing</h3>
              <p className="text-muted-foreground">Direct from the continent to ensure premium quality and authentic taste.</p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Fast Shipping</h3>
              <p className="text-muted-foreground">Reliable and fast delivery across Canada, straight to your doorstep.</p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Quality Guaranteed</h3>
              <p className="text-muted-foreground">We carefully vet all our products to guarantee satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Our Categories</h2>
            <p className="text-muted-foreground max-w-2xl text-lg">We source the highest quality ingredients directly from the continent to ensure your meals are perfectly authentic.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href="/catalog" className="group relative overflow-hidden rounded-2xl aspect-4/3 bg-muted shadow-lg border border-border/50">
                <Image 
                  src={category.image} 
                  alt={category.name} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Featured Products</h2>
              <p className="text-muted-foreground text-lg">Our most loved authentic ingredients.</p>
            </div>
            <Link href="/catalog" className="hidden md:flex items-center text-primary hover:text-primary/80 font-medium">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link href="/catalog" className={buttonVariants({ variant: "outline", className: "w-full" })}>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary/5 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Join the AfriBite Family</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Subscribe to our newsletter to get 10% off your first order, plus exclusive access to new arrivals and authentic recipes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                />
                <button type="button" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90 h-12 px-8 py-2 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
