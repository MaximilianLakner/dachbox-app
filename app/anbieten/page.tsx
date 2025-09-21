'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, X, Plus, Camera, CreditCard, AlertCircle } from 'lucide-react'
import { MOUNTING_TYPES, EXTRAS } from '@/types'
import toast from 'react-hot-toast'
import { supabase, testMinimalInsert } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import StripeConnectSetup from '@/components/StripeConnectSetup'

interface DachboxFormData {
  model: string
  brand: string
  volume: number
  length: number
  width: number
  height: number
  mounting_type: string
  pickup_location?: string
  pickup_city: string
  pickup_postal_code: string
  pickup_address?: string
  description: string
  condition: string
  price_per_day: number
  includes_roof_rack: boolean
  roof_rack_price?: number
  has_lock: boolean
  extras: string[]
  contact_name: string
  contact_phone?: string
  contact_email?: string
  contact_preference?: 'phone' | 'email' | 'whatsapp' | 'signal' | 'sms'
  contact_notes?: string
}

export default function AnbietenPage() {
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stripeAccountStatus, setStripeAccountStatus] = useState<any>(null)
  const [checkingStripe, setCheckingStripe] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  const form = useForm<DachboxFormData>({
    defaultValues: {
      includes_roof_rack: false,
      has_lock: false,
      extras: []
    }
  })

  // Check for edit parameter in URL and Stripe status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const editParam = urlParams.get('edit')
    if (editParam) {
      setEditId(editParam)
      loadDachboxForEdit(editParam)
    }
    
    if (user) {
      checkStripeAccountStatus()
    }
  }, [user])

  const checkStripeAccountStatus = async () => {
    try {
      const response = await fetch('/api/stripe/check-connect-status')
      const data = await response.json()
      setStripeAccountStatus(data)
    } catch (error) {
      console.error('Error checking Stripe status:', error)
    } finally {
      setCheckingStripe(false)
    }
  }

  const loadDachboxForEdit = async (id: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('dachboxes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Populate form with existing data
        form.reset({
          model: data.model,
          brand: data.brand,
          volume: data.volume,
          length: data.length,
          width: data.width,
          height: data.height,
          mounting_type: data.mounting_type,
          pickup_location: data.pickup_location,
          pickup_city: data.pickup_city,
          pickup_postal_code: data.pickup_postal_code,
          description: data.description,
          condition: data.condition,
          price_per_day: data.price_per_day,
          includes_roof_rack: data.includes_roof_rack,
          roof_rack_price: data.roof_rack_price,
          has_lock: data.has_lock,
          extras: data.extras || [],
          contact_name: data.contact_name || ''
        })
        
        // Load existing images
        setExistingImages(data.images || [])
        toast.success('Dachbox-Daten geladen')
      }
    } catch (error) {
      console.error('Error loading dachbox for edit:', error)
      toast.error('Fehler beim Laden der Dachbox-Daten')
    } finally {
      setIsLoading(false)
    }
  }
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  const includesRoofRack = watch('includes_roof_rack')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 7) {
      toast.error('Maximal 7 Bilder erlaubt')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: DachboxFormData) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    // Check Stripe Connect status for new uploads (not edits)
    if (!editId && (!stripeAccountStatus?.onboarding_completed)) {
      toast.error('Du musst zuerst deine Zahlungsdetails einrichten, um eine Dachbox anbieten zu können.')
      return
    }

    setIsSubmitting(true)
    try {
      // Only require 3 images for new uploads, not for edits
      if (!editId && images.length < 3) {
        toast.error('Bitte lade mindestens 3 Bilder hoch')
        setIsSubmitting(false)
        return
      }

      // Handle images - either upload new ones or keep existing ones
      let finalImagePaths: string[] = []
      
      if (images.length > 0) {
        // Upload new images
        for (const image of images) {
          const fileExt = image.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${user.id}/${fileName}`
          
          const { error: uploadError } = await supabase.storage
            .from('dachbox-images')
            .upload(filePath, image)
          
          if (uploadError) {
            throw new Error(`Fehler beim Hochladen von ${image.name}: ${uploadError.message}`)
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('dachbox-images')
            .getPublicUrl(filePath)
          
          finalImagePaths.push(publicUrl)
        }
      } else if (editId && existingImages.length > 0) {
        // Keep existing images if no new images uploaded
        finalImagePaths = existingImages
      }
      
      // Ensure we have at least 3 images for new uploads
      if (!editId && finalImagePaths.length < 3) {
        throw new Error('Bitte lade mindestens 3 Bilder hoch')
      }

      // 2) Prepare database insert with detailed logging
      const dachboxRecord = {
        user_id: user.id,
        model: data.model,
        brand: data.brand,
        volume: parseInt(data.volume.toString()),
        length: parseInt(data.length.toString()),
        width: parseInt(data.width.toString()),
        height: parseInt(data.height.toString()),
        mounting_type: data.mounting_type,
        pickup_location: data.pickup_location?.trim() || 'Nicht spezifiziert',
        pickup_city: data.pickup_city,
        pickup_postal_code: data.pickup_postal_code,
        pickup_address: 'Wird bei Buchung bekannt gegeben',
        description: data.description,
        condition: data.condition,
        price_per_day: parseInt(data.price_per_day.toString()),
        includes_roof_rack: Boolean(data.includes_roof_rack),
        roof_rack_price: data.roof_rack_price ? parseInt(data.roof_rack_price.toString()) : null,
        has_lock: Boolean(data.has_lock),
        extras: data.extras || [],
        images: finalImagePaths,
        is_available: true
      }

      console.log('Attempting database operation:', editId ? 'UPDATE' : 'INSERT')
      console.log('Record:', dachboxRecord)
      console.log('User ID:', user.id)
      console.log('Images processed:', finalImagePaths.length)

      let result, dbError
      
      if (editId) {
        // Update existing dachbox
        const { user_id, ...updateData } = dachboxRecord // Remove user_id from update
        
        const response = await supabase
          .from('dachboxes')
          .update(updateData)
          .eq('id', editId)
          .eq('user_id', user.id) // Ensure user owns the dachbox
          .select('id')
          .single()
          
        result = response.data
        dbError = response.error
      } else {
        // Insert new dachbox
        const response = await supabase
          .from('dachboxes')
          .insert(dachboxRecord)
          .select('id')
          .single()
          
        result = response.data
        dbError = response.error
      }

      console.log('Database insert result:', result)
      console.log('Database insert error:', dbError)

      if (dbError) {
        console.error('Database error details:', dbError)
        // Clean up uploaded images if database insert fails (only for new uploads)
        if (images.length > 0) {
          for (const imagePath of finalImagePaths) {
            const fileName = imagePath.split('/').pop()
            if (fileName) {
              await supabase.storage.from('dachbox-images').remove([`${user.id}/${fileName}`])
            }
          }
        }
        throw new Error(`Datenbankfehler: ${dbError.message}`)
      }

      toast.success(editId ? 'Deine Dachbox wurde erfolgreich aktualisiert!' : 'Deine Dachbox wurde erfolgreich eingestellt!')
      form.reset()
      setImages([])
      setEditId(null)
      router.push(`/dachbox/${result?.id || editId}`)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Fehler beim Einstellen der Dachbox')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dachbox anbieten</h1>
          <p className="text-gray-600 mb-4">
            Füllen Sie das Formular aus, um Ihre Dachbox zu vermieten und zusätzliches Geld zu verdienen.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Wichtig:</strong> Um Zahlungen zu erhalten, müssen Sie eine Zahlungsmethode in Ihrem Konto hinterlegen. 
                  <Link href="/account?tab=payment" className="ml-1 font-medium text-blue-700 hover:text-blue-600 underline">
                    Jetzt Zahlungsmethode hinzufügen
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Connect Setup Warning */}
        {user && !editId && checkingStripe && (
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
              <span className="text-gray-600">Überprüfe Zahlungseinstellungen...</span>
            </div>
          </div>
        )}

        {user && !editId && !checkingStripe && !stripeAccountStatus?.onboarding_completed && (
          <div className="mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">
                    Zahlungsdetails erforderlich
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Um eine Dachbox anbieten zu können, musst du zuerst deine Zahlungsdetails einrichten. 
                    Dies ermöglicht es dir, Zahlungen von Mietern zu erhalten.
                  </p>
                  <StripeConnectSetup onSetupComplete={checkStripeAccountStatus} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Account erstellen
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="deine@email.de"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vorname
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Max"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nachname
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Mustermann"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer (optional)
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+49 123 456 789"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stadt
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="München"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PLZ
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="80331"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="btn-primary flex-1"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Account erstellen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Grunddaten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marke *
                </label>
                <input
                  {...register('brand', { required: 'Marke ist erforderlich' })}
                  className="input-field"
                  placeholder="z.B. Thule, Kamei, Hapro"
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modell *
                </label>
                <input
                  {...register('model', { required: 'Modell ist erforderlich' })}
                  className="input-field"
                  placeholder="z.B. Motion XT L"
                />
                {errors.model && (
                  <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Maße und Volumen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volumen (Liter) *
                </label>
                <input
                  type="number"
                  {...register('volume', { 
                    required: 'Volumen ist erforderlich',
                    min: { value: 50, message: 'Volumen muss mindestens 50 Liter sein' },
                    max: { value: 1000, message: 'Volumen darf maximal 1000 Liter sein' }
                  })}
                  className="input-field"
                  placeholder="320"
                />
                {errors.volume && (
                  <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Länge (cm) *
                </label>
                <input
                  type="number"
                  {...register('length', { 
                    required: 'Länge ist erforderlich',
                    min: { value: 50, message: 'Länge muss mindestens 50 cm sein' },
                    max: { value: 300, message: 'Länge darf maximal 300 cm sein' }
                  })}
                  className="input-field"
                  placeholder="200"
                />
                {errors.length && (
                  <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breite (cm) *
                </label>
                <input
                  type="number"
                  {...register('width', { 
                    required: 'Breite ist erforderlich',
                    min: { value: 30, message: 'Breite muss mindestens 30 cm sein' },
                    max: { value: 150, message: 'Breite darf maximal 150 cm sein' }
                  })}
                  className="input-field"
                  placeholder="80"
                />
                {errors.width && (
                  <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Höhe (cm) *
              </label>
              <input
                type="number"
                {...register('height', { 
                  required: 'Höhe ist erforderlich',
                  min: { value: 20, message: 'Höhe muss mindestens 20 cm sein' },
                  max: { value: 80, message: 'Höhe darf maximal 80 cm sein' }
                })}
                className="input-field"
                placeholder="40"
              />
              {errors.height && (
                <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
              )}
            </div>
          </div>

          {/* Mounting and Location */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Befestigung und Abhol-Region
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Befestigungsart *
                </label>
                <select
                  {...register('mounting_type', { required: 'Befestigungsart ist erforderlich' })}
                  className="input-field"
                >
                  <option value="">Befestigungsart wählen</option>
                  {Object.entries(MOUNTING_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {errors.mounting_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.mounting_type.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stadt *
                  </label>
                  <input
                    {...register('pickup_city', { required: 'Stadt ist erforderlich' })}
                    className="input-field"
                    placeholder="München"
                  />
                  {errors.pickup_city && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickup_city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PLZ *
                  </label>
                  <input
                    {...register('pickup_postal_code', { 
                      required: 'PLZ ist erforderlich',
                      pattern: {
                        value: /^[0-9]{5}$/,
                        message: 'PLZ muss genau 5 Ziffern haben'
                      }
                    })}
                    className="input-field"
                    placeholder="80331"
                    maxLength={5}
                  />
                  {errors.pickup_postal_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickup_postal_code.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Optional: Bereich/Ortsteil (keine genaue Adresse)
                </label>
                <input
                  {...register('pickup_location')}
                  className="input-field"
                  placeholder="z. B. München Schwabing"
                />
              </div>
            </div>
          </div>

          {/* Description and Condition */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Beschreibung und Zustand
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschreibung *
                </label>
                <textarea
                  {...register('description', { required: 'Beschreibung ist erforderlich' })}
                  rows={4}
                  className="input-field"
                  placeholder="Beschreibe deine Dachbox, besondere Merkmale, etc."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zustand *
                </label>
                <select
                  {...register('condition', { required: 'Zustand ist erforderlich' })}
                  className="input-field"
                >
                  <option value="">Zustand wählen</option>
                  <option value="excellent">Sehr gut</option>
                  <option value="good">Gut</option>
                  <option value="fair">Befriedigend</option>
                  <option value="poor">Ausreichend</option>
                </select>
                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Preise
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preis pro Tag (€) *
                </label>
                <div className="relative">
                  <input
                    {...register('price_per_day', { 
                      required: 'Preis ist erforderlich',
                      min: { value: 5, message: 'Mindestpreis: 5€' },
                      max: { value: 50, message: 'Höchstpreis: 50€' }
                    })}
                    type="number"
                    min="5"
                    max="50"
                    className="input-field pl-8"
                    placeholder="15"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                </div>
                {errors.price_per_day && (
                  <p className="text-red-500 text-sm mt-1">{errors.price_per_day.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Mindestpreis: 5€, Höchstpreis: 50€
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    {...register('includes_roof_rack')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Dachträger ist im Preis inbegriffen
                  </label>
                </div>

                {!includesRoofRack && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aufpreis für Dachträger (€)
                    </label>
                    <div className="relative">
                      <input
                        {...register('roof_rack_price')}
                        type="number"
                        min="0"
                        className="input-field pl-8"
                        placeholder="5"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Ausstattung
            </h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  {...register('has_lock')}
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Dachbox hat ein Schloss
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extras (optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {EXTRAS.map((extra) => (
                    <label key={extra} className="flex items-center">
                      <input
                        {...register('extras')}
                        type="checkbox"
                        value={extra}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{extra}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Bilder
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  {editId ? 'Bilder (optional - leer lassen um bestehende zu behalten)' : 'Bilder hochladen (mindestens 3)'}
                </label>
                
                {/* Show existing images in edit mode */}
                {editId && existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Aktuelle Bilder:</p>
                    <div className="grid grid-cols-3 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Existing ${index + 1}`}
                            className="w-full object-cover rounded-lg"
                            style={{ aspectRatio: '4/3' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klicke zum Hochladen</span> oder ziehe Dateien hierher
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG oder JPEG (max. 10MB pro Datei)</p>
                      {editId && <p className="text-xs text-blue-500 mt-1">Neue Bilder ersetzen die bestehenden</p>}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full object-cover rounded-lg"
                          style={{ aspectRatio: '4/3' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {!editId && images.length < 3 && (
                <p className="text-red-500 text-sm">
                  Mindestens 3 Bilder sind erforderlich ({images.length}/3)
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
            >
              Schließen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{editId ? 'Wird aktualisiert...' : 'Wird hochgeladen...'}</span>
                </>
              ) : (
                <span>{editId ? 'Aktualisieren' : 'Dachbox anbieten'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
