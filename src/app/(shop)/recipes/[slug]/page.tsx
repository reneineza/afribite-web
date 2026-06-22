import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Clock, ChefHat, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function getRecipe(slug: string) {
  const supabase = await createClient()
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !recipe) {
    return null
  }
  return recipe
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-muted">
        <Image 
          src={recipe.image_url || 'https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=2000&auto=format&fit=crop'} 
          alt={recipe.title} 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 max-w-4xl">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
          
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/recipes">Recipes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{recipe.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border mb-8 text-muted-foreground font-medium">
            {recipe.cooking_time && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                {recipe.cooking_time}
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-primary" />
                {recipe.difficulty}
              </div>
            )}
            <div className="flex items-center text-sm ml-auto">
              Published on {new Date(recipe.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary">
            {/* Extremely simple Markdown-like line break rendering for plain text content */}
            {recipe.content.split('\n').map((line: string, i: number) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>
              if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-2">{line.replace('- ', '')}</li>
              if (line.trim() === '') return <br key={i} />
              return <p key={i} className="mb-4">{line}</p>
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 bg-primary/5 rounded-xl p-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Need ingredients?</h3>
              <p className="text-muted-foreground">Shop our authentic African spices and staples to make this dish perfect.</p>
            </div>
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                Shop Ingredients
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
