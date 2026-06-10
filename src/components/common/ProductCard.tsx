import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
          />
          {product.comparison_price && product.comparison_price > product.price && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">Sale</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-1">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-accent">★</span> {product.rating} ({product.reviews_count})
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
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}
