import { Percent, Tag } from 'lucide-react'
import Image from 'next/image'

const deals = [
  { name: 'Premium Red Palm Oil 1L', originalPrice: 15.99, price: 12.99, tag: '-19%', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80' },
  { name: 'Nigerian Suya Spice Blend', originalPrice: 8.99, price: 5.99, tag: '-33%', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80' },
  { name: 'Jollof Rice Seasoning Mix', originalPrice: 6.99, price: 4.99, tag: '-28%', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80' },
]

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-secondary/10 py-16 md:py-24 border-b border-secondary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary text-primary-foreground mb-6 shadow-lg">
            <Percent className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Special Offers</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">Discover amazing deals on your favorite African products. Limited time offers, stock up while supplies last!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div key={deal.name} className="group flex flex-col bg-white rounded-xl border border-primary/10 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Tag className="h-3 w-3" />
                  {deal.tag}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{deal.name}</h3>
                <div className="mt-auto flex items-end gap-2">
                  <span className="text-xl font-bold text-primary">${deal.price}</span>
                  <span className="text-sm text-foreground/50 line-through mb-1">${deal.originalPrice}</span>
                </div>
                <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-medium group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
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
