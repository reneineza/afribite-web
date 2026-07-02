'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  // 1. Ensure user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to create a category.')
  }

  // 2. Extract Data
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File | null

  if (!name) {
    throw new Error('Category name is required.')
  }

  // Generate unique slug
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`

  let image = ''

  // 3. Upload Image to Supabase Storage if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `cat-${slug}-${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images') // Reusing product-images bucket or could be categories
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

    image = publicUrlData.publicUrl
  }

  // 4. Insert into Supabase database
  const { error: insertError } = await supabase
    .from('categories')
    .insert({
      name,
      slug,
      description,
      image_url: image || null
    })

  if (insertError) {
    console.error('Failed to insert category:', insertError)
    throw new Error(`Failed to save category: ${insertError.message}`)
  }

  // 5. Revalidate cache and redirect
  revalidatePath('/admin/categories')
  revalidatePath('/admin/products/new')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // 1. Ensure user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to delete a category.')
  }

  // 2. Delete from Supabase database
  const { error: deleteError } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('Failed to delete category:', deleteError)
    throw new Error(`Failed to delete category: ${deleteError.message}`)
  }

  // 3. Revalidate cache
  revalidatePath('/admin/categories')
  revalidatePath('/admin/products/new')
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to update a category.')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File | null

  if (!name) {
    throw new Error('Category name is required.')
  }

  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`

  const updateData: Record<string, string> = {
    name,
    slug,
    description,
  }

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `cat-${slug}-${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path)

    updateData.image_url = publicUrlData.publicUrl
  }

  const { error: updateError } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)

  if (updateError) {
    console.error('Failed to update category:', updateError)
    throw new Error(`Failed to update category: ${updateError.message}`)
  }

  revalidatePath('/admin/categories')
  revalidatePath('/admin/products/new')
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/categories')
  
  redirect('/admin/categories')
}
