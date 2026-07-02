import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ProductCard, type Product } from '@/components/common/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { NewsletterForm } from '@/components/NewsletterForm'
// Mock Data
export default async function Home() {
  const supabase = await createClient()
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(4)
  const { data: dbCategories } = await supabase.from('categories').select('*').order('created_at')
  const categories = dbCategories || []
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Featured Categories */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Our Categories</h2>
            <p className="text-muted-foreground max-w-2xl text-lg">We source the highest quality ingredients directly from the continent to ensure your meals are perfectly authentic.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group relative overflow-hidden rounded-2xl aspect-4/3 bg-muted shadow-lg border border-border/50">
                <Image 
                  src={category.image_url || 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=600&auto=format&fit=crop'} 
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
            <Link href="/shop" className="hidden md:flex items-center text-primary hover:text-primary/80 font-medium">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link href="/shop" className={buttonVariants({ variant: "outline", className: "w-full" })}>
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
              <NewsletterForm variant="home" />
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}


