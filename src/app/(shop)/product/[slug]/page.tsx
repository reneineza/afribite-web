import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ReviewForm } from './ReviewForm'
import { AddToCart } from '@/components/common/AddToCart'

import { createClient } from '@/lib/supabase/server'

async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
  return product
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, email)')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })

  const averageRating = reviews?.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New'
  const reviewCount = reviews?.length || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted border border-border">
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop'} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.comparison_price && (
               <Badge className="absolute top-4 left-4 text-sm px-3 py-1 bg-destructive text-destructive-foreground">Sale</Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-accent text-lg">★</div>
            <span className="text-sm font-medium text-foreground">{averageRating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-4 mt-4">
            <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.comparison_price && (
              <span className="text-xl line-through text-muted-foreground">${product.comparison_price.toFixed(2)}</span>
            )}
          </div>

          <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator className="my-6" />

          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Status</span>
                {product.stock_quantity > 0 ? (
                  <span className="text-primary font-medium">In Stock ({product.stock_quantity})</span>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
             </div>
             
             <div className="flex gap-4 mt-4">
               <AddToCart 
                 product={{
                   id: product.id,
                   name: product.name,
                   slug: product.slug,
                   price: product.price,
                   comparison_price: product.comparison_price,
                   images: product.images || [],
                   rating: Number(averageRating) || 0,
                   reviews_count: reviewCount
                 }} 
                 stockQuantity={product.stock_quantity} 
               />
             </div>
          </div>

          <Tabs defaultValue="description" className="mt-10">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Description</TabsTrigger>
              <TabsTrigger value="ingredients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Nutrition</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Reviews ({reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4 text-muted-foreground">
              {product.description}
              <div className="mt-4 text-foreground">
                <strong className="text-foreground">Country of Origin:</strong> {product.origin_country}
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="pt-4 text-muted-foreground">
              {product.ingredients}
            </TabsContent>
            <TabsContent value="nutrition" className="pt-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Calories</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info?.calories || '-'}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Carbs</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info?.carbs || '-'}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Protein</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info?.protein || '-'}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Fat</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info?.fat || '-'}</span>
                 </div>
               </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-6">
                {reviews?.map((review: { id: string, created_at: string, rating: number, comment: string, profiles: { full_name: string, email: string } }) => (
                  <div key={review.id} className="border-b border-border pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{review.profiles?.full_name || review.profiles?.email || 'Verified Buyer'}</p>
                        <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-accent text-lg flex tracking-tighter">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-foreground mt-2">{review.comment}</p>
                  </div>
                ))}
                {(!reviews || reviews.length === 0) && (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
              <ReviewForm productId={product.id} slug={product.slug} />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  )
}
