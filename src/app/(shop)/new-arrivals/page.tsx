import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function NewArrivalsPage() {
  const products = [
    { name: 'Handcrafted Shea Butter', price: 14.99, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80' },
    { name: 'Premium Plantain Chips', price: 4.99, image: 'https://images.unsplash.com/photo-1599598425947-330026217c5b?auto=format&fit=crop&q=80' },
    { name: 'Organic Hibiscus Tea Leaves', price: 9.99, image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80' },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-linear-to-br from-primary/5 to-secondary/10 py-16 md:py-24 border-b border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border border-primary/10 text-primary mb-6 shadow-sm">
            <Sparkles className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">New Arrivals</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">Be the first to try our freshest additions. We constantly source new authentic products to bring you the best of Africa.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.name} className="group flex flex-col bg-white rounded-xl border border-primary/10 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  NEW
                </div>
              </div>
              <div className="p-5 flex flex-col items-center text-center">
                <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                <span className="text-lg font-bold text-primary">${product.price}</span>
                <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
