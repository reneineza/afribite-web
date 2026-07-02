'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // 1. Ensure user is admin (RLS also handles this, but good to check early)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to create a product.')
  }

  // 2. Extract Data
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock_quantity = parseInt(formData.get('stock') as string, 10)
  const imageFile = formData.get('image') as File | null
  const category_id = formData.get('category_id') as string | null

  if (!name || isNaN(price) || isNaN(stock_quantity)) {
    throw new Error('Missing required fields.')
  }

  // Generate unique slug and SKU
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`
  const sku = `PRD-${Date.now().toString().slice(-6)}`

  const images: string[] = []

  // 3. Upload Image to Supabase Storage if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${slug}-${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Image upload failed:', uploadError)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path)

    images.push(publicUrlData.publicUrl)
  }

  // 4. Insert into Supabase database
  const { error: insertError } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      description,
      category_id: category_id || null,
      price,
      stock_quantity,
      sku,
      images,
      is_active: true
    })

  if (insertError) {
    console.error('Failed to insert product:', insertError)
    throw new Error(`Failed to save product: ${insertError.message}`)
  }

  // 5. Revalidate cache and redirect
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  redirect('/admin/products')
}
