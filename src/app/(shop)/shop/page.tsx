import { ProductCard, type Product } from '@/components/common/ProductCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CatalogFilters } from '@/components/common/CatalogFilters'

import { createClient } from '@/lib/supabase/server'

export default async function CatalogPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  let query = supabase.from('products').select('*').eq('is_active', true)

  // Searching
  if (searchParams?.q && typeof searchParams.q === 'string') {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  // Price Filtering
  if (searchParams?.min && typeof searchParams.min === 'string') {
    query = query.gte('price', parseFloat(searchParams.min))
  }
  if (searchParams?.max && typeof searchParams.max === 'string') {
    query = query.lte('price', parseFloat(searchParams.max))
  }

  // Category Filtering
  const selectedCategories = searchParams?.category
  if (selectedCategories) {
    const categorySlugs = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories]
    
    const { data: matchedCats } = await supabase.from('categories').select('id').in('slug', categorySlugs)
    if (matchedCats && matchedCats.length > 0) {
      const catIds = matchedCats.map(c => c.id)
      query = query.in('category_id', catIds)
    }
  }

  // Sorting
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'newest'
  if (sort === 'price-low') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price-high') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products, error } = await query
  
  // Fetch categories for sidebar
  const { data: dbCategories } = await supabase.from('categories').select('*').order('name')

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <CatalogFilters dbCategories={dbCategories || []} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map(product => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
          
          {(!products || products.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
