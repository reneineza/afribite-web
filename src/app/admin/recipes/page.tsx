"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  const fetchRecipes = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
    if (data) setRecipes(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const content = formData.get('content') as string
    const image_url = formData.get('image_url') as string
    const cooking_time = formData.get('cooking_time') as string
    const difficulty = formData.get('difficulty') as string

    const supabase = createClient()
    const { error } = await supabase.from('recipes').insert([
      { title, slug, content, image_url, cooking_time, difficulty, is_published: true }
    ])

    if (!error) {
      setIsAdding(false)
      fetchRecipes()
    } else {
      console.error(error)
      alert("Failed to save recipe")
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('recipes').delete().eq('id', id)
    fetchRecipes()
  }

  if (loading && recipes.length === 0) return <div className="p-8">Loading recipes...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Recipes</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add New Recipe'}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipe Title</label>
                  <input type="text" name="title" required className="w-full h-10 px-3 border rounded-md" placeholder="e.g. Authentic Party Jollof" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL (Optional)</label>
                  <input type="url" name="image_url" className="w-full h-10 px-3 border rounded-md" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cooking Time</label>
                  <input type="text" name="cooking_time" className="w-full h-10 px-3 border rounded-md" placeholder="e.g. 45 mins" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <input type="text" name="difficulty" className="w-full h-10 px-3 border rounded-md" placeholder="e.g. Easy, Medium, Hard" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipe Content (Ingredients & Steps)</label>
                <textarea name="content" required rows={10} className="w-full p-3 border rounded-md resize-y" placeholder="Use Markdown or plain text. E.g. \n\n## Ingredients\n- 2 cups rice\n- 1 can tomatoes\n\n## Steps\n1. Blend tomatoes..."></textarea>
              </div>
              <Button type="submit" disabled={loading}>Save Recipe</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <Card key={recipe.id} className="relative overflow-hidden">
            {recipe.image_url && (
              <div className="relative h-32 w-full bg-muted">
                <Image src={String(recipe.image_url)} alt={String(recipe.title)} fill className="object-cover" />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{recipe.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {recipe.is_published ? 'Published' : 'Draft'}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(recipe.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {recipes.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border rounded-lg">
            No recipes found. Add one to get started!
          </div>
        )}
      </div>
    </div>
  )
}
