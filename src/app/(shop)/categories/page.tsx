import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

const categories = [
  { name: 'Spices & Seasonings', description: 'Authentic African spices to elevate your meals.', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80', href: '/shop?category=spices' },
  { name: 'Snacks & Beverages', description: 'Popular treats and drinks from across the continent.', image: 'https://images.unsplash.com/photo-1599598425947-330026217c5b?auto=format&fit=crop&q=80', href: '/shop?category=snacks' },
  { name: 'Grains & Flours', description: 'Essential staples for traditional African dishes.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80', href: '/shop?category=grains' },
  { name: 'Oils & Sauces', description: 'Rich palm oil, marinades, and specialized cooking sauces.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80', href: '/shop?category=oils' },
  { name: 'Meat & Seafood', description: 'Premium cuts, smoked fish, and traditional proteins.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80', href: '/shop?category=meat' },
  { name: 'Health & Beauty', description: 'Natural skincare and holistic health products.', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80', href: '/shop?category=beauty' },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary/5 py-16 md:py-24 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Shop by Category</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">Explore our curated selection of premium African products, neatly organized to help you find exactly what you need.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group relative rounded-2xl overflow-hidden border border-primary/10 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  {category.name}
                  <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
