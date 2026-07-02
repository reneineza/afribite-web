import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateCategory } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!category) {
    notFound()
  }

  const updateCategoryWithId = updateCategory.bind(null, category.id)

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Update the details for this product category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateCategoryWithId} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" name="name" defaultValue={category.name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={category.description || ''} />
            </div>

            <div className="space-y-2">
              <Label>Current Image</Label>
              {category.image_url ? (
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                  <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No image uploaded.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload New Image (Optional)</Label>
              <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">This will replace the current image if provided.</p>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/admin/categories" className={cn(buttonVariants({ variant: "outline" }))}>
                Cancel
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
