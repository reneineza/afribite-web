import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductCard } from '@/components/common/ProductCard'

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's wishlist and join the product details
  const { data: wishlistItems, error } = await supabase
    .from('wishlists')
    .select('*, products(*)')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlists:', error)
  }

  // Extract the products from the joined query
  const products = wishlistItems?.map(item => item.products).filter(Boolean) || []

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">My Wishlist</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-xl font-medium text-foreground">Your wishlist is empty</h3>
          <p className="text-muted-foreground mt-2">Tap the heart icon on any product to save it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
