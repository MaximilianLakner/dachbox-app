'use client'

import { useState, useEffect } from 'react'
import { Star, User, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer_id: string
  reviewer_name?: string
}

interface ReviewListProps {
  dachboxId: string
  refreshTrigger?: number
}

export default function ReviewList({ dachboxId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer_id,
          users!reviewer_id (
            first_name,
            last_name
          )
        `)
        .eq('dachbox_id', dachboxId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const reviewsWithNames = data?.map(review => ({
        ...review,
        reviewer_name: review.users 
          ? `${(review.users as any).first_name} ${(review.users as any).last_name}`
          : 'Anonymer Nutzer'
      })) || []

      setReviews(reviewsWithNames)
      
      // Calculate average rating
      if (reviewsWithNames.length > 0) {
        const avg = reviewsWithNames.reduce((sum, review) => sum + review.rating, 0) / reviewsWithNames.length
        setAverageRating(Math.round(avg * 10) / 10)
      } else {
        setAverageRating(0)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [dachboxId, refreshTrigger])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Bewertungen</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Bewertungen ({reviews.length})
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center space-x-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm font-medium text-gray-600">
              {averageRating} von 5
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>Noch keine Bewertungen vorhanden.</p>
          <p className="text-sm">Sei der Erste, der diese Dachbox bewertet!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.reviewer_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(review.created_at)}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
