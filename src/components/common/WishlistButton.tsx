'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleWishlist } from '@/actions/wishlist'
import { usePathname } from 'next/navigation'

export function WishlistButton({ productId, initiallyWished = false }: { productId: string, initiallyWished?: boolean }) {
  const [isWished, setIsWished] = useState(initiallyWished)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const result = await toggleWishlist(productId, pathname)
        setIsWished(result)
      } catch (err) {
        alert("Please log in to save items to your wishlist.")
      }
    })
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-full transition-colors absolute top-2 right-2 bg-background/80 backdrop-blur-sm shadow-sm z-10 hover:bg-background ${isWished ? 'text-red-500 border-red-500/50' : 'text-muted-foreground'}`}
    >
      <Heart className="h-4 w-4" fill={isWished ? "currentColor" : "none"} />
    </Button>
  )
}
