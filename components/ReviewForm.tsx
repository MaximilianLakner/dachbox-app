'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  bookingId: string
  dachboxId: string
  onReviewSubmitted: () => void
}

export default function ReviewForm({ bookingId, dachboxId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Bitte wähle eine Bewertung aus')
      return
    }
    
    if (comment.trim().length < 10) {
      toast.error('Bitte schreibe mindestens 10 Zeichen')
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Du musst angemeldet sein')
        return
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          dachbox_id: dachboxId,
          reviewer_id: user.id,
          rating,
          comment: comment.trim()
        })

      if (error) {
        throw error
      }

      toast.success('Bewertung erfolgreich abgegeben!')
      setRating(0)
      setComment('')
      onReviewSubmitted()
    } catch (error: any) {
      console.error('Review submission error:', error)
      toast.error('Fehler beim Abgeben der Bewertung')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-gray-900">Bewertung abgeben</h3>
      
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bewertung
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-colors"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kommentar
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Teile deine Erfahrung mit dieser Dachbox..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-1">
          {comment.length}/500 Zeichen
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Wird abgegeben...' : 'Bewertung abgeben'}
      </button>
    </form>
  )
}
