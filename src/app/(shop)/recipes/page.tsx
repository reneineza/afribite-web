import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Clock, ChefHat } from 'lucide-react'

export default async function RecipesPage() {
  const supabase = await createClient()
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recipes:', error)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">African Recipes</h1>
        <p className="text-lg text-muted-foreground">
          Discover authentic recipes from across the continent. From savory Jollof to rich Egusi, learn how to cook traditional meals with our premium ingredients.
        </p>
      </div>

      {(!recipes || recipes.length === 0) ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">More Recipes Coming Soon!</h2>
          <p className="text-muted-foreground">We&apos;re currently cooking up some amazing recipes for you. Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
              <Card className="overflow-hidden group h-full hover:border-primary/50 transition-colors">
                <CardHeader className="p-0 aspect-video relative overflow-hidden bg-muted">
                  <Image 
                    src={recipe.image_url || 'https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=600&auto=format&fit=crop'} 
                    alt={recipe.title} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </CardHeader>
                <CardContent className="p-6 flex flex-col h-[43.75%]">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-auto pt-4 text-sm text-muted-foreground">
                    {recipe.cooking_time && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {recipe.cooking_time}
                      </div>
                    )}
                    {recipe.difficulty && (
                      <div className="flex items-center">
                        <ChefHat className="w-4 h-4 mr-1.5" />
                        {recipe.difficulty}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
