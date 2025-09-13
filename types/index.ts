export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  city: string
  postal_code: string
  created_at: string
  updated_at: string
}

export interface Dachbox {
  id: string
  user_id: string
  model: string
  brand: string
  volume: number
  length: number
  width: number
  height: number
  mounting_type: MountingType
  pickup_location?: string
  pickup_city: string
  pickup_postal_code: string
  pickup_address?: string
  description: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  price_per_day: number
  includes_roof_rack: boolean
  roof_rack_price?: number
  has_lock: boolean
  extras: string[]
  images: string[]
  is_available: boolean
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  contact_preference?: 'phone' | 'email' | 'whatsapp' | 'signal' | 'sms'
  contact_notes?: string
  created_at: string
  updated_at: string
  user?: User
}

export type MountingType = 
  | 'quertraeger-u-buegel'
  | 'quertraeger-schnellspann'
  | 'quertraeger-t-nut'
  | 'reling-erhoeht'
  | 'reling-buendig'
  | 'fixpunkte'
  | 'regenrinne'
  | 'nackt-dach-saugnapf'
  | 'nackt-dach-gurt'
  | 'soft-roof'

export interface Booking {
  id: string
  dachbox_id: string
  renter_id: string
  owner_id: string
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_intent_id?: string
  created_at: string
  updated_at: string
  dachbox?: Dachbox
  renter?: User
  owner?: User
}

export interface Review {
  id: string
  booking_id: string
  dachbox_id: string
  reviewer_id: string
  rating: number
  comment: string
  created_at: string
  reviewer?: User
}

export interface SearchFilters {
  location?: string
  postal_code?: string
  min_price?: number
  max_price?: number
  mounting_type?: MountingType[]
  min_volume?: number
  max_volume?: number
  has_lock?: boolean
  extras?: string[]
  includes_roof_rack?: boolean
}

export const MOUNTING_TYPES = {
  'quertraeger-u-buegel': 'Querträger U-Bügel/Klemmschellen',
  'quertraeger-schnellspann': 'Querträger Schnellspann-System',
  'quertraeger-t-nut': 'Querträger T-Nut/T-Track',
  'reling-erhoeht': 'Erhöhte Dachreling',
  'reling-buendig': 'Bündige Reling',
  'fixpunkte': 'Fixpunkte/Hersteller-Befestigung',
  'regenrinne': 'Regenrinne (ältere Fahrzeuge)',
  'nackt-dach-saugnapf': 'Nackt-Dach Saugnapf/Vakuum',
  'nackt-dach-gurt': 'Nackt-Dach Gurtbefestigung',
  'soft-roof': 'Soft-Roof/Textil-Lösung'
} as const

export const EXTRAS = [
  'Spanngurte',
  'Trennwände',
  'Ski-Durchreiche',
  'Tasche',
  'Schlüssel',
  'Schutzabdeckung',
  'Zusatzschloss',
  'LED-Beleuchtung'
] as const
