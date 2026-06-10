import { ProductCard, type Product } from '@/components/common/ProductCard'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// Mock Data for MVP design phase
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Jollof Rice Spice Mix', slug: 'jollof-spice', price: 12.99, comparison_price: 15.99, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop'], rating: 4.8, reviews_count: 124 },
  { id: '2', name: 'Dried Crayfish (Ground)', slug: 'dried-crayfish', price: 18.50, images: ['https://images.unsplash.com/photo-1627485937980-221c88ce04ea?q=80&w=600&auto=format&fit=crop'], rating: 4.5, reviews_count: 89 },
  { id: '3', name: 'Pounded Yam Flour (Iyan)', slug: 'pounded-yam', price: 24.99, images: ['https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=600&auto=format&fit=crop'], rating: 4.9, reviews_count: 210 },
  { id: '4', name: 'Nigerian Red Palm Oil', slug: 'red-palm-oil', price: 14.00, images: ['https://images.unsplash.com/photo-1474128670149-7082a8d370ea?q=80&w=600&auto=format&fit=crop'], rating: 4.7, reviews_count: 56 },
  { id: '5', name: 'Gari (Cassava Flakes)', slug: 'gari-yellow', price: 9.99, images: ['https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=600&auto=format&fit=crop'], rating: 4.6, reviews_count: 34 },
  { id: '6', name: 'Egusi Seeds (Melon)', slug: 'egusi-seeds', price: 16.50, images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop'], rating: 4.4, reviews_count: 21 },
]

export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4 text-foreground">Filters</h2>
            <Input type="search" placeholder="Search products..." className="mb-4" />
          </div>

          <Accordion type="multiple" defaultValue={["categories", "price"]} className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger className="text-foreground">Categories</AccordionTrigger>
              <AccordionContent className="space-y-3">
                {['Spices & Seasonings', 'Grains & Flours', 'Beans & Legumes', 'Oils', 'Snacks'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`cat-${category}`} />
                    <Label htmlFor={`cat-${category}`} className="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category}
                    </Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger className="text-foreground">Price Range</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                 <div className="flex items-center gap-2">
                   <Input type="number" placeholder="Min" className="h-8" />
                   <span className="text-muted-foreground">-</span>
                   <Input type="number" placeholder="Max" className="h-8" />
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-foreground">All Products</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="mb-6" />

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
