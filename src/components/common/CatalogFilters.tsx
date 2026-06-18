'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const CATEGORIES = ['Spices & Seasonings', 'Grains & Flours', 'Beans & Legumes', 'Oils', 'Snacks']

export function CatalogFilters({ dbCategories = [] }: { dbCategories?: { id: string, slug: string, name: string }[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '')

  const currentCategories = searchParams.getAll('category')

  const createQueryString = (name: string, value: string, addMultiple = false) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) {
      params.delete(name)
    } else if (addMultiple) {
      params.append(name, value)
    } else {
      params.set(name, value)
    }
    return params.toString()
  }

  const removeQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const values = params.getAll(name)
    params.delete(name)
    values.filter(v => v !== value).forEach(v => params.append(name, v))
    return params.toString()
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const queryString = checked 
      ? createQueryString('category', category, true)
      : removeQueryString('category', category)
    router.push(`${pathname}?${queryString}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('q', search)
    else params.delete('q')
    if (minPrice) params.set('min', minPrice)
    else params.delete('min')
    if (maxPrice) params.set('max', maxPrice)
    else params.delete('max')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4 text-foreground">Filters</h2>
        <div className="flex gap-2 mb-4">
          <Input 
            type="search" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Accordion defaultValue={["categories", "price"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-foreground">Categories</AccordionTrigger>
          <AccordionContent className="space-y-3">
            {dbCategories.length > 0 ? dbCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${category.slug}`} 
                  checked={currentCategories.includes(category.slug)}
                  onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
                />
                <Label htmlFor={`cat-${category.slug}`} className="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {category.name}
                </Label>
              </div>
            )) : CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${category}`} 
                  checked={currentCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`cat-${category}`} className="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {category}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-foreground">Price Range</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
             <div className="flex items-center gap-2">
               <Input 
                 type="number" 
                 placeholder="Min" 
                 className="h-8" 
                 value={minPrice}
                 onChange={(e) => setMinPrice(e.target.value)}
               />
               <span className="text-muted-foreground">-</span>
               <Input 
                 type="number" 
                 placeholder="Max" 
                 className="h-8" 
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(e.target.value)}
               />
             </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button type="submit" className="w-full">Apply Filters</Button>
    </form>
  )
}
