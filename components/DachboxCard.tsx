'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Lock, Car } from 'lucide-react'
import { Dachbox } from '@/types'

interface DachboxCardProps {
  dachbox: Dachbox
}

export default function DachboxCard({ dachbox }: DachboxCardProps) {
  return (
    <Link href={`/dachbox/${dachbox.id}`} className="group">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 group p-4">
        {/* Image */}
        <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-gray-100">
          {dachbox.images && dachbox.images.length > 0 ? (
            <Image
              src={dachbox.images[0]}
              alt={`${dachbox.brand} ${dachbox.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              Verfügbar
            </span>
            {dachbox.includes_roof_rack && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                + Dachträger
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title and Rating */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                {dachbox.brand} {dachbox.model}
              </h3>
              <p className="text-sm text-gray-600 font-medium">{dachbox.volume}L Volumen</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{dachbox.pickup_city} {dachbox.pickup_postal_code}</span>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                {dachbox.price_per_day}€
              </span>
              <span className="text-gray-500 text-sm ml-1 font-medium">/Tag</span>
            </div>
            <div className="text-right">
              <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <p className="text-xs text-green-700 font-semibold">Verfügbar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
