import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const categories = [
    { name: 'Spices & Seasonings', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
    { name: 'Grains & Flours', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=600&auto=format&fit=crop' },
    { name: 'Snacks & Beverages', image: 'https://images.unsplash.com/photo-1621245464303-125439a03975?q=80&w=600&auto=format&fit=crop' }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2000&auto=format&fit=crop" 
            alt="African Food Ingredients" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-background/80 md:bg-background/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
          <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/30 text-sm px-4 py-1 border border-primary/50">
            Now Shipping Across Canada
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6">
            Authentic African Flavors, <br />
            <span className="text-primary">Delivered to You.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
            Your premier destination for premium spices, fresh ingredients, and authentic African groceries in Canada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/catalog">Shop the Catalog</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-primary text-primary hover:bg-primary/10">
              <Link href="/login">Sign In</Link>
            </Button>
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
              <Link key={index} href="/catalog" className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted shadow-lg border border-border/50">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-8">
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 text-center border-t border-border mt-auto bg-background">
        <p className="text-muted-foreground mb-6">© 2026 AfriBite Canada. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Catalog</Link>
          <Link href="/cart" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Cart</Link>
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Admin Panel</Link>
        </div>
      </footer>
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
