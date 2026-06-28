import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { WishlistButton } from '@/components/common/WishlistButton'
import { Star } from 'lucide-react'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparison_price?: number
  images: string[]
  is_featured?: boolean
  rating: number
  reviews_count: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0] || '/placeholder.png'
  
  return (
    <Card className="overflow-hidden group flex flex-col h-full border-border/50 hover:border-border transition-colors">
      <Link href={`/product/${product.slug}`} className="flex-1">
        <CardHeader className="p-0 aspect-square relative overflow-hidden bg-muted">
          <Image 
            src={imageUrl} 
            alt={product.name} 
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300"
          />
          {product.comparison_price && product.comparison_price > product.price && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">Sale</Badge>
          )}
          <WishlistButton productId={product.id} />
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-1">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" /> {product.rating} ({product.reviews_count})
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.comparison_price && (
              <span className="text-sm line-through text-muted-foreground">${product.comparison_price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link 
          href={`/product/${product.slug}`} 
          className={buttonVariants({ variant: 'default', className: "w-full" })}
        >
          View Options
        </Link>
      </CardFooter>
    </Card>
  )
}
