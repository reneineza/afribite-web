import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createCategory } from '../actions'

export default function NewCategoryPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Enter the details for the new product category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" name="name" placeholder="e.g. Traditional Spices" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="A short description of this category..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">Upload an image file directly from your device.</p>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/admin/categories" className={cn(buttonVariants({ variant: "outline" }))}>
                Cancel
              </Link>
              <Button type="submit">Save Category</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
