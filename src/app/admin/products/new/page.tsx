import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createProduct } from '../actions'

export default function NewProductPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Enter the information for the new product to add it to your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" placeholder="e.g. Premium Jollof Rice Spice Mix" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="A rich blend of traditional spices..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (CAD) *</Label>
                <Input id="price" name="price" type="number" placeholder="12.99" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock *</Label>
                <Input id="stock" name="stock" type="number" placeholder="50" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
              <p className="text-xs text-muted-foreground">Upload an image file directly from your device.</p>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/admin/products" className={cn(buttonVariants({ variant: "outline" }))}>
                Cancel
              </Link>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
