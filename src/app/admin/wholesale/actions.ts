'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateWholesaleStatus(id: string, newStatus: string) {
  const supabase = await createClient()

  // Ensure user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to perform this action.')
  }

  const { error } = await supabase
    .from('wholesale_applications')
    .update({ status: newStatus })
    .eq('id', id)

  if (error) {
    console.error('Failed to update wholesale application status:', error)
    throw new Error(`Failed to update status: ${error.message}`)
  }

  revalidatePath('/admin/wholesale')
}

export async function deleteWholesaleApplication(id: string) {
  const supabase = await createClient()

  // Ensure user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to perform this action.')
  }

  const { error } = await supabase
    .from('wholesale_applications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete wholesale application:', error)
    throw new Error(`Failed to delete application: ${error.message}`)
  }

  revalidatePath('/admin/wholesale')
}
