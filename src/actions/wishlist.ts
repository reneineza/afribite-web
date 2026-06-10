'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string, pathname: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not logged in')
  }

  // Check if it already exists
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('profile_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id)
  } else {
    await supabase.from('wishlists').insert({
      profile_id: user.id,
      product_id: productId
    })
  }

  // Revalidate the current page so UI updates reflect the new state
  revalidatePath(pathname)
  return !existing
}
