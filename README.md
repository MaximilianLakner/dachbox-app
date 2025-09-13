

# DachBox - Dachbox Vermietungsplattform

Eine moderne Web-App für die Vermietung von Dachboxen. Nutzer können ihre Dachboxen vermieten oder eine passende für ihren Urlaub finden.

## 🚀 Features

### Für Mieter
- **Suchen & Finden**: Intelligente Suche nach Standort, Preis und Ausstattung
- **Filter**: Nach Volumen, Befestigungsart, Schloss, Extras und mehr
- **Sichere Buchung**: Zahlungen über Stripe abgesichert
- **Bewertungen**: Transparente Bewertungen von anderen Nutzern

### Für Anbieter
- **Einfaches Anbieten**: Dachbox in wenigen Minuten einstellen
- **Bild-Upload**: Bis zu 7 Bilder hochladen
- **Preisgestaltung**: Flexibel zwischen 5€ und 50€ pro Tag
- **Einnahmen**: Bis zu 50€ pro Tag möglich

### Technische Features
- **Responsive Design**: Optimiert für alle Geräte
- **Moderne UI**: Attraktives Design mit Tailwind CSS
- **TypeScript**: Typsichere Entwicklung
- **Supabase Backend**: Skalierbare Datenbank
- **Stripe Integration**: Sichere Zahlungsabwicklung

## 🛠️ Technologie-Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Zahlungen**: Stripe Connect
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd dachbox-app
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp env.example .env.local
   ```
   
   Fülle die folgenden Variablen aus:
   - `NEXT_PUBLIC_SUPABASE_URL`: Deine Supabase Projekt-URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Dein Supabase Anon Key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Dein Stripe Publishable Key
   - `STRIPE_SECRET_KEY`: Dein Stripe Secret Key

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **App öffnen**
   Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 🗄️ Datenbankschema

### Tabellen

#### `users`
- `id` (uuid, primary key)
- `email` (text, unique)
- `first_name` (text)
- `last_name` (text)
- `phone` (text, optional)
- `city` (text)
- `postal_code` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `dachboxes`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `model` (text)
- `brand` (text)
- `volume` (integer)
- `length` (integer)
- `width` (integer)
- `height` (integer)
- `mounting_type` (text)
- `pickup_location` (text)
- `pickup_city` (text)
- `pickup_postal_code` (text)
- `pickup_address` (text)
- `description` (text)
- `condition` (text)
- `price_per_day` (integer)
- `includes_roof_rack` (boolean)
- `roof_rack_price` (integer, optional)
- `has_lock` (boolean)
- `extras` (text[])
- `images` (text[])
- `is_available` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `bookings`
- `id` (uuid, primary key)
- `dachbox_id` (uuid, foreign key)
- `renter_id` (uuid, foreign key)
- `owner_id` (uuid, foreign key)
- `start_date` (date)
- `end_date` (date)
- `total_price` (integer)
- `status` (text)
- `payment_intent_id` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `reviews`
- `id` (uuid, primary key)
- `booking_id` (uuid, foreign key)
- `dachbox_id` (uuid, foreign key)
- `reviewer_id` (uuid, foreign key)
- `rating` (integer)
- `comment` (text)
- `created_at` (timestamp)

## 🎨 Design-System

### Farben
- **Primary**: Blau-Töne (#3b82f6)
- **Secondary**: Grau-Töne (#64748b)
- **Success**: Grün (#10b981)
- **Warning**: Gelb (#f59e0b)
- **Error**: Rot (#ef4444)

### Komponenten
- **Buttons**: `btn-primary`, `btn-secondary`
- **Inputs**: `input-field`
- **Cards**: `card`
- **Hero**: `hero-gradient`

## 📱 Seiten

1. **Homepage** (`/`) - Hero Section mit Suchfunktion und Angebotsvorschau
2. **Angebote** (`/angebote`) - Suchfunktion mit Filtern
3. **Dachbox anbieten** (`/anbieten`) - Formular zum Einstellen einer Dachbox
4. **Dachbox Details** (`/dachbox/[id]`) - Detailansicht mit Bildergalerie
5. **How To** (`/how-to`) - Informationen und Vorteile
6. **Account** (`/account`) - Benutzerprofil und Einstellungen

## 🔧 Entwicklung

### Verfügbare Scripts

```bash
# Entwicklungsserver
npm run dev

# Produktions-Build
npm run build

# Produktions-Server
npm start

# Linting
npm run lint
```

### Projektstruktur

```
dachbox-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # Globale Styles
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Homepage
│   ├── angebote/          # Angebote Seite
│   ├── anbieten/          # Dachbox anbieten
│   ├── dachbox/[id]/      # Dachbox Details
│   ├── how-to/            # How To Seite
│   └── account/           # Account Seite
├── components/            # React Komponenten
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── DachboxCard.tsx
├── lib/                   # Utility Funktionen
│   ├── supabase.ts
│   └── stripe.ts
├── types/                 # TypeScript Typen
│   └── index.ts
└── public/               # Statische Dateien
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. Verbinde dein GitHub Repository mit Vercel
2. Konfiguriere die Umgebungsvariablen in Vercel
3. Deploy automatisch bei jedem Push

### Andere Plattformen

Die App kann auf jeder Plattform deployed werden, die Next.js unterstützt:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Öffne eine Pull Request

## 📞 Support

Bei Fragen oder Problemen erstelle ein Issue im GitHub Repository oder kontaktiere uns unter support@dachbox.de.
# DachboxApp
