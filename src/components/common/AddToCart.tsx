"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { type Product } from "@/components/common/ProductCard"
import { toast } from "sonner" // Assuming sonner is used for toasts, if not we can add it or remove

interface AddToCartProps {
  product: Product
  stockQuantity: number
}

export function AddToCart({ product, stockQuantity }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const increaseQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity(q => q + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    // Optional: add a small visual feedback here if toast is available
    if (typeof toast !== 'undefined' && toast.success) {
      toast.success(`${quantity} x ${product.name} added to cart!`)
    } else {
      // Fallback native alert if sonner isn't setup
      alert(`${quantity} x ${product.name} added to cart!`)
    }
  }

  const isOutOfStock = stockQuantity <= 0

  return (
    <div className="flex gap-4 mt-4">
      <div className={`flex items-center border border-input rounded-md px-3 bg-background ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
        <button 
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || isOutOfStock}
          className="px-3 py-2 hover:text-primary transition-colors disabled:opacity-50"
        >
          -
        </button>
        <span className="px-4 font-medium text-foreground w-12 text-center">{quantity}</span>
        <button 
          onClick={increaseQuantity}
          disabled={quantity >= stockQuantity || isOutOfStock}
          className="px-3 py-2 hover:text-primary transition-colors disabled:opacity-50"
        >
          +
        </button>
      </div>
      <Button 
        size="lg" 
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="flex-1 text-lg h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
