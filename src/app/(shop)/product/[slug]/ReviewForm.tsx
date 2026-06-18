'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitReview } from './actions'

export function ReviewForm({ productId, slug }: { productId: string, slug: string }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        await submitReview(productId, rating, comment, slug)
        setComment('') // Clear form on success
        setRating(5)
      } catch (err: unknown) {
        setError((err as Error).message || 'An error occurred while submitting your review.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg border border-border">
      <h3 className="font-semibold text-lg text-foreground">Write a Review</h3>
      
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Rating</label>
        <select 
          className="border border-input rounded-md px-3 py-1.5 bg-background text-foreground text-sm focus:ring-2 focus:ring-primary"
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>★★★★★ (5/5)</option>
          <option value={4}>★★★★☆ (4/5)</option>
          <option value={3}>★★★☆☆ (3/5)</option>
          <option value={2}>★★☆☆☆ (2/5)</option>
          <option value={1}>★☆☆☆☆ (1/5)</option>
        </select>
      </div>

      <Textarea 
        placeholder="Share your thoughts about this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        className="min-h-[100px]"
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
