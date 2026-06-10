import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  const categories = [
    { name: 'Spices & Seasonings', slug: 'spices-seasonings', description: 'Authentic African spice blends and seasonings.' },
    { name: 'Grains & Flours', slug: 'grains-flours', description: 'Traditional grains, rice, and fufu flours.' },
    { name: 'Beans & Legumes', slug: 'beans-legumes', description: 'Protein-rich beans and lentils.' },
    { name: 'Oils & Fats', slug: 'oils-fats', description: 'Pure palm oil, shea butter, and other cooking oils.' },
    { name: 'Snacks & Beverages', slug: 'snacks-beverages', description: 'Delicious plantain chips, chin chin, and drinks.' }
  ]

  const { data, error } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error seeding categories:', error)
  } else {
    console.log('Successfully seeded categories:', data.length)
  }
}

seed()
