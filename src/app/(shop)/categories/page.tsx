import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: dbCategories } = await supabase.from('categories').select('*').order('created_at')
  const categories = dbCategories || []
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
            <Link key={category.id} href={`/shop?category=${category.slug}`} className="group relative rounded-2xl overflow-hidden border border-primary/10 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src={category.image_url || 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80'} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
