import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

// Mock fetching function for MVP
async function getProduct(slug: string) {
  const products = [
    { 
      id: '1', 
      name: 'Premium Jollof Rice Spice Mix', 
      slug: 'jollof-spice', 
      price: 12.99, 
      comparison_price: 15.99, 
      images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop'], 
      rating: 4.8, 
      reviews_count: 124,
      description: 'Authentic Nigerian Jollof Rice spice blend. Made with the finest sun-dried tomatoes, roasted bell peppers, and traditional West African herbs. Perfect for achieving that signature smoky party jollof taste.',
      ingredients: 'Dried Tomatoes, Red Bell Peppers, Onion Powder, Garlic Powder, Thyme, Curry Powder, Bay Leaves, Ginger, Salt.',
      origin_country: 'Nigeria',
      stock_quantity: 50,
      nutrition_info: { calories: 15, carbs: '3g', protein: '1g', fat: '0g' }
    }
  ]
  return products.find(p => p.slug === slug) || null
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
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
              src={product.images[0]} 
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
            <div className="flex text-accent text-lg">★★★★★</div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews_count} reviews)</span>
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
               <div className="flex items-center border border-input rounded-md px-3 bg-background">
                 <button className="px-3 py-2 hover:text-primary transition-colors">-</button>
                 <span className="px-4 font-medium text-foreground">1</span>
                 <button className="px-3 py-2 hover:text-primary transition-colors">+</button>
               </div>
               <Button size="lg" className="flex-1 text-lg h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                 Add to Cart
               </Button>
             </div>
          </div>

          <Tabs defaultValue="description" className="mt-10">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Description</TabsTrigger>
              <TabsTrigger value="ingredients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent py-3 px-4">Nutrition</TabsTrigger>
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
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info.calories}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Carbs</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info.carbs}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Protein</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info.protein}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted rounded-md border border-border">
                   <span className="text-muted-foreground">Fat</span>
                   <span className="font-medium text-lg text-foreground">{product.nutrition_info.fat}</span>
                 </div>
               </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  )
}
