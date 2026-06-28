import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, HeartHandshake, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=2000&auto=format&fit=crop" 
            alt="African Market" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            Our Story
          </h1>
          <p className="text-xl text-slate-200">
            Bringing the authentic taste of the motherland to your kitchen, wherever you are.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">The AfriBite Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                AfriBite was born out of a simple necessity: the craving for home. We realized how difficult it was to find high-quality, authentic African spices, grains, and specialty ingredients in Canada.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to bridge that gap. We partner directly with farmers and trusted suppliers across the African continent to source premium ingredients. We ensure that every product we sell meets our strict quality standards so that your Jollof tastes exactly the way your grandmother makes it.
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=600&auto=format&fit=crop" 
                alt="Spices" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="mb-4 flex justify-center">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Authenticity</h3>
              <p className="text-muted-foreground">No substitutes. We provide the real ingredients essential for traditional recipes.</p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="mb-4 flex justify-center">
                <HeartHandshake className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground">We celebrate the rich diversity of African cuisine and the cultures that create it.</p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="mb-4 flex justify-center">
                <Star className="w-10 h-10 text-primary fill-primary/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="text-muted-foreground">Premium sourcing and careful packaging to ensure freshness upon delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to cook something amazing?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Browse our catalog of authentic spices, flours, snacks, and more.
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg rounded-full">
              Shop Authentic Flavors
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
