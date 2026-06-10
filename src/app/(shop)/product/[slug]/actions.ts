'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(productId: string, rating: number, comment: string, slug: string) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to leave a review.')
  }

  // Insert review into database
  const { error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      profile_id: user.id,
      rating,
      comment
    })

  if (error) {
    console.error('Failed to submit review:', error)
    throw new Error('Failed to submit review.')
  }

  // Revalidate the product page to immediately show the new review
  revalidatePath(`/product/${slug}`)
  return { success: true }
}
