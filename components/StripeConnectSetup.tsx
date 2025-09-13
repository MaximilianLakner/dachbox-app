'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, ExternalLink, CreditCard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase-client'

interface StripeConnectSetupProps {
  onSetupComplete?: () => void
}

export default function StripeConnectSetup({ onSetupComplete }: StripeConnectSetupProps) {
  const [loading, setLoading] = useState(false)
  const [accountStatus, setAccountStatus] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const { user } = useAuth() as any

  useEffect(() => {
    if (user) {
      checkAccountStatus()
    }
  }, [user])

  const checkAccountStatus = async () => {
    if (!user) {
      setChecking(false)
      return
    }
    
    try {
      setChecking(true)
      
      // Check directly via Supabase client
      const { data: userData, error } = await supabase
        .from('users')
        .select('stripe_connect_account_id, stripe_onboarding_completed')
        .eq('id', user.id)
        .single()
      
      if (error || !userData) {
        console.error('Error fetching user data:', error)
        setAccountStatus({ has_account: false, onboarding_completed: false })
        return
      }
      
      setAccountStatus({
        has_account: !!userData.stripe_connect_account_id,
        onboarding_completed: userData.stripe_onboarding_completed || false,
        account_id: userData.stripe_connect_account_id
      })
    } catch (error) {
      console.error('Error checking account status:', error)
      setAccountStatus({ has_account: false, onboarding_completed: false })
    } finally {
      setChecking(false)
    }
  }

  const createConnectAccount = async () => {
    if (!user) {
      alert('Bitte logge dich zuerst ein')
      return
    }

    try {
      setLoading(true)
      
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Session abgelaufen. Bitte logge dich erneut ein.')
        return
      }

      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        window.location.href = data.onboarding_url
      } else {
        alert(`Fehler: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating Connect account:', error)
      alert(`Netzwerkfehler: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (accountStatus?.onboarding_completed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Zahlungen eingerichtet</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Dein Stripe Connect Konto ist vollständig eingerichtet. Du kannst jetzt Dachboxen vermieten und Zahlungen erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Zahlungen aktiviert
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Auszahlungen aktiviert
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (accountStatus?.has_account && !accountStatus?.onboarding_completed) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800">Setup noch nicht abgeschlossen</CardTitle>
          </div>
          <CardDescription className="text-yellow-700">
            Du hast bereits ein Stripe Konto erstellt, aber das Setup ist noch nicht vollständig abgeschlossen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createConnectAccount}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <ExternalLink className="h-4 w-4 mr-2" />
            )}
            Setup fortsetzen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-500" />
          <CardTitle>Zahlungen einrichten</CardTitle>
        </div>
        <CardDescription>
          Um Dachboxen zu vermieten, musst du zuerst deine Zahlungsdetails hinterlegen. 
          Wir verwenden Stripe für sichere Zahlungsabwicklung.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-2">Was passiert als nächstes?</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Du wirst zu Stripe weitergeleitet</li>
            <li>• Gib deine Bankdaten und Identitätsdaten ein</li>
            <li>• Nach der Verifizierung kannst du Zahlungen erhalten</li>
            <li>• 10% jeder Transaktion gehen als Plattformgebühr an DachBox</li>
          </ul>
        </div>
        
        <Button 
          onClick={createConnectAccount}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          Zahlungen einrichten
        </Button>
      </CardContent>
    </Card>
  )
}
