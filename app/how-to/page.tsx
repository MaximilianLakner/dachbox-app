'use client'

import { 
  Search, 
  Car, 
  CheckCircle, 
  Shield, 
  Clock, 
  Star, 
  DollarSign, 
  Users, 
  MapPin,
  Calendar,
  CreditCard,
  MessageCircle,
  Award,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function HowToPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Wie funktioniert DachBox?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Entdecke die einfachste Art, deine Dachbox zu vermieten oder eine passende 
              für deinen nächsten Urlaub zu finden. Alles was du wissen musst.
            </p>
          </div>
        </div>
      </section>

      {/* For Renters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dachbox mieten
            </h2>
            <p className="text-xl text-gray-600">
              So einfach findest du die perfekte Dachbox für deinen Urlaub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Suchen & Finden</h3>
              <p className="text-gray-600">
                Gib deinen Standort ein und finde verfügbare Dachboxen in deiner Nähe. 
                Nutze unsere Filter für Volumen, Preis und Ausstattung.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Datum wählen</h3>
              <p className="text-gray-600">
                Wähle deine gewünschten Abhol- und Rückgabedaten. 
                Buche nur für die Zeit, die du wirklich brauchst.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Sicher bezahlen</h3>
              <p className="text-gray-600">
                Bezahle sicher über Stripe. Deine Zahlung wird erst nach der Abholung 
                an den Anbieter weitergeleitet.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Vorteile für Mieter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ul className="space-y-5">
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Geld sparen</h4>
                    <p className="text-gray-600">Miete statt kaufen - spare hunderte von Euro bei deiner nächsten Reise</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Clock className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Flexibel</h4>
                    <p className="text-gray-600">Buche nur für die Zeit, die du wirklich brauchst - von einem Tag bis zu Wochen</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <MapPin className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Lokale Verfügbarkeit</h4>
                    <p className="text-gray-600">Finde Dachboxen in deiner Nähe - keine langen Anfahrtswege</p>
                  </div>
                </li>
              </ul>
              <ul className="space-y-5">
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sicher & Versichert</h4>
                    <p className="text-gray-600">Alle Buchungen sind versichert und durch Stripe abgesichert</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Star className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Qualität</h4>
                    <p className="text-gray-600">Alle Dachboxen werden von uns geprüft und bewertet</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Zap className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Schnell & Einfach</h4>
                    <p className="text-gray-600">Buchung in wenigen Minuten - keine komplizierten Prozesse</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dachbox vermieten
            </h2>
            <p className="text-xl text-gray-600">
              Verdiene Geld mit deiner Dachbox und hilf anderen bei ihrem Abenteuer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Dachbox einstellen</h3>
              <p className="text-gray-600">
                Erstelle ein Profil für deine Dachbox mit Fotos, Beschreibung und Preisen. 
                Das dauert nur wenige Minuten.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Buchungen erhalten</h3>
              <p className="text-gray-600">
                Erhalte Benachrichtigungen über neue Buchungen und kommuniziere 
                direkt mit den Mietern.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Geld verdienen</h3>
              <p className="text-gray-600">
                Erhalte deine Einnahmen sicher über Stripe Connect. 
                Bis zu 50€ pro Tag möglich!
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Vorteile für Anbieter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ul className="space-y-5">
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Passives Einkommen</h4>
                    <p className="text-gray-600">Verdiene bis zu 50€ pro Tag mit deiner Dachbox, die sonst nur rumsteht</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Users className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Gemeinschaft</h4>
                    <p className="text-gray-600">Hilf anderen bei ihrem nächsten Abenteuer und baue eine Community auf</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sicherheit</h4>
                    <p className="text-gray-600">Alle Mieter werden verifiziert und alle Zahlungen sind abgesichert</p>
                  </div>
                </li>
              </ul>
              <ul className="space-y-5">
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Clock className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Flexibel</h4>
                    <p className="text-gray-600">Bestimme selbst, wann deine Dachbox verfügbar ist</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Award className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Bewertungen</h4>
                    <p className="text-gray-600">Baue dein Vertrauen durch positive Bewertungen auf</p>
                  </div>
                </li>
                <li className="grid grid-cols-[28px,1fr] gap-3 items-start">
                  <Zap className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Einfach</h4>
                    <p className="text-gray-600">Keine komplizierten Prozesse - alles über unsere Plattform</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preise & Gebühren
            </h2>
            <p className="text-xl text-gray-600">
              Transparente Preise ohne versteckte Kosten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Für Mieter
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dachbox-Miete</span>
                  <span className="font-medium">5€ - 50€ / Tag</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dachträger (optional)</span>
                  <span className="font-medium">0€ - 10€ / Tag</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service-Gebühr</span>
                  <span className="font-medium text-green-600">Kostenlos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Versicherung</span>
                  <span className="font-medium text-green-600">Inklusive</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Für Anbieter
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plattform-Gebühr</span>
                  <span className="font-medium">10% vom Umsatz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Zahlungsabwicklung</span>
                  <span className="font-medium">2.9% + 0.30€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Einstellungsgebühr</span>
                  <span className="font-medium text-green-600">Kostenlos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Auszahlung</span>
                  <span className="font-medium text-green-600">Sofort verfügbar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Security */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sicherheit & Vertrauen
            </h2>
            <p className="text-xl text-gray-600">
              Deine Sicherheit ist uns wichtig
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifizierte Nutzer</h3>
              <p className="text-gray-600">
                Alle Nutzer werden über E-Mail und Telefonnummer verifiziert. 
                Keine anonymen Buchungen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sichere Zahlungen</h3>
              <p className="text-gray-600">
                Alle Zahlungen werden über Stripe abgewickelt. 
                Deine Kreditkartendaten sind sicher.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bewertungssystem</h3>
              <p className="text-gray-600">
                Bewerte deine Erfahrungen und hilf anderen bei der Entscheidung. 
                Transparenz schafft Vertrauen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit loszulegen?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Starte jetzt dein nächstes Abenteuer oder verdiene Geld mit deiner Dachbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/angebote" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Dachbox finden
            </Link>
            <Link href="/anbieten" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
              Dachbox anbieten
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
