'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Car, 
  Calendar,
  Star,
  CreditCard,
  Settings,
  LogOut,
  Plus
} from 'lucide-react'
import { User as UserType, Dachbox } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import StripeConnectSetup from '@/components/StripeConnectSetup'

// Real data from Supabase

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('payment')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profile, setProfile] = useState<UserType | null>(null)
  const [myBoxes, setMyBoxes] = useState<Dachbox[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  const { user, signOut, loading: authLoading } = useAuth() as any
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'delete') {
      return
    }
    
    setIsSubmitting(true)
    try {
      // Delete user account from Supabase
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) {
        throw error
      }
      
      // Sign out and redirect
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Fehler beim Löschen des Accounts. Bitte versuche es erneut.')
    } finally {
      setIsSubmitting(false)
      setShowDeleteModal(false)
      setDeleteConfirmation('')
    }
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserType>()

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    const load = async () => {
      // Lade oder erstelle Profildatensatz
      const { data: userRow, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      let current = userRow as any
      if (!current) {
        const upsertPayload = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          phone: user.user_metadata?.phone || null,
          city: user.user_metadata?.city || '',
          postal_code: user.user_metadata?.postal_code || ''
        }
        const { data: created } = await supabase
          .from('users')
          .insert(upsertPayload)
          .select('*')
          .single()
        current = created as any
      }

      if (current) {
        setProfile(current)
        reset(current)
      }

      const { data: boxes } = await supabase
        .from('dachboxes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setMyBoxes((boxes || []) as any)

      // Load user's bookings
      const { data: userBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setBookings((userBookings || []) as any)

      // Load user's reviews
      const { data: userReviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setReviews((userReviews || []) as any)
    }
    load()
  }, [user, authLoading, reset])

  const onSubmit = async (data: UserType) => {
    setIsSubmitting(true)
    try {
      // Hier würde die Supabase-Integration stattfinden
      console.log('Updating user data:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'payment', label: 'Zahlungsmethoden', icon: CreditCard },
    { id: 'dachboxes', label: 'Meine Dachboxen', icon: Car },
    { id: 'bookings', label: 'Meine Buchungen', icon: Calendar },
    { id: 'reviews', label: 'Bewertungen', icon: Star },
    { id: 'payments', label: 'Zahlungen', icon: CreditCard },
    { id: 'settings', label: 'Einstellungen', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mein Account
          </h1>
          <p className="text-gray-600">
            Verwalte dein Profil, deine Dachboxen und Buchungen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Zahlungsmethoden
                  </h2>
                  <Link 
                    href="/account/payment"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Zahlungsmethode hinzufügen</span>
                  </Link>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Ihre Zahlungsdaten werden sicher über Stripe verarbeitet und niemals auf unseren Servern gespeichert.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Zahlungsmethoden</h3>
                  <p className="mt-1 text-sm text-gray-500">Fügen Sie eine Zahlungsmethode hinzu, um schneller zu buchen.</p>
                  <div className="mt-6">
                    <Link
                      href="/account/payment"
                      className="btn-primary inline-flex items-center"
                    >
                      <Plus className="-ml-1 mr-2 h-4 w-4" />
                      Zahlungsmethode hinzufügen
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profil bearbeiten
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Bearbeiten</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Abbrechen</span>
                      </button>
                      <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSubmitting ? 'Speichern...' : 'Speichern'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vorname
                      </label>
                      <input
                        {...register('first_name', { required: 'Vorname ist erforderlich' })}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nachname
                      </label>
                      <input
                        {...register('last_name', { required: 'Nachname ist erforderlich' })}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail
                    </label>
                    <input
                      {...register('email', { 
                        required: 'E-Mail ist erforderlich',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Ungültige E-Mail-Adresse'
                        }
                      })}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonnummer
                    </label>
                    <input
                      {...register('phone')}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stadt
                      </label>
                      <input
                        {...register('city', { required: 'Stadt ist erforderlich' })}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PLZ
                      </label>
                      <input
                        {...register('postal_code', { required: 'PLZ ist erforderlich' })}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-100"
                      />
                      {errors.postal_code && (
                        <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Dachboxes Tab */}
            {activeTab === 'dachboxes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Meine Dachboxen
                  </h2>
                  <button onClick={() => router.push('/anbieten')} className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Neue Dachbox</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myBoxes.map((dachbox) => (
                    <div key={dachbox.id} className="card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {dachbox.brand} {dachbox.model}
                          </h3>
                          <p className="text-2xl font-bold text-primary-600">
                            {dachbox.price_per_day}€/Tag
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          dachbox.is_available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dachbox.is_available ? 'Verfügbar' : 'Gebucht'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => router.push(`/anbieten?edit=${dachbox.id}`)}
                          className="btn-secondary text-sm"
                        >
                          Bearbeiten
                        </button>
                        <button 
                          onClick={() => router.push(`/dachbox/${dachbox.id}`)}
                          className="btn-secondary text-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                  {myBoxes.length === 0 && (
                    <div className="text-gray-600">Du hast noch keine Dachbox eingestellt.</div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Meine Buchungen
                </h2>

                <div className="space-y-4">
                  {bookings.length > 0 ? bookings.map((booking: any) => (
                    <div key={booking.id} className="card">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {booking.dachbox_brand} {booking.dachbox_model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Von {booking.owner_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.start_date).toLocaleDateString('de-DE')} - {new Date(booking.end_date).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {booking.total_price}€
                          </p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'completed'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Bestätigt' : 
                             booking.status === 'completed' ? 'Abgeschlossen' : 
                             'Ausstehend'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      Du hast noch keine Buchungen.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Meine Bewertungen
                </h2>

                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map((review: any) => (
                    <div key={review.id} className="card">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {review.dachbox_brand} {review.dachbox_model}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      Du hast noch keine Bewertungen abgegeben.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Zahlungen & Auszahlungen
                </h2>

                <StripeConnectSetup />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Einstellungen
                </h2>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Benachrichtigungen
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">E-Mail-Benachrichtigungen</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">Neue Buchungen</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">Marketing-E-Mails</span>
                    </label>
                  </div>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Datenschutz
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-secondary text-sm">
                      Daten herunterladen
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="btn-secondary text-sm text-red-600 hover:text-red-700"
                    >
                      Account löschen
                    </button>
                  </div>
                </div>

                <div className="card">
                  <button 
                    onClick={handleSignOut}
                    className="btn-secondary flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Abmelden</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Account löschen</h3>
              <button 
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten, Dachboxen und Buchungen werden permanent gelöscht.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Gib <strong>"delete"</strong> ein, um zu bestätigen:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="delete"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'delete' || isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Wird gelöscht...' : 'Account löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
