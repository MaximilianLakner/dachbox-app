# 🚀 DachBox Vercel Deployment Guide

## Schritt 1: GitHub Repository erstellen

1. **Gehe zu GitHub.com** und erstelle ein neues Repository
2. **Repository Name**: `dachbox-platform`
3. **Visibility**: Private (empfohlen)
4. **Initialisiere NICHT** mit README, .gitignore oder LICENSE

## Schritt 2: Code zu GitHub pushen

```bash
# Im Projektordner
git init
git add .
git commit -m "Initial commit: DachBox platform"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/dachbox-platform.git
git push -u origin main
```

## Schritt 3: Vercel Account & Deployment

1. **Gehe zu vercel.com** und melde dich mit GitHub an
2. **Klicke "New Project"**
3. **Wähle dein Repository** aus
4. **Framework Preset**: Next.js (automatisch erkannt)
5. **Root Directory**: . (Punkt)
6. **Build Command**: `npm run build`
7. **Output Directory**: .next
8. **Install Command**: `npm install`

## Schritt 4: Environment Variables in Vercel

Gehe zu **Project Settings → Environment Variables** und füge hinzu:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: https://wsuhgngrxalxqrztcmtg.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [Dein Anon Key]
- `SUPABASE_SERVICE_ROLE_KEY`: [Service Role Key aus Supabase]

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: pk_test_51S6qtbIe7K8W0sJW...
- `STRIPE_SECRET_KEY`: sk_test_51S6qtbIe7K8W0sJW...
- `STRIPE_WEBHOOK_SECRET`: [Wird später für Webhooks benötigt]

### App
- `NEXT_PUBLIC_APP_URL`: https://dein-app-name.vercel.app

## Schritt 5: Supabase Service Role Key finden

1. **Gehe zu deinem Supabase Dashboard**
2. **Settings → API**
3. **Kopiere den "service_role" Key** (nicht den anon key!)

## Schritt 6: Domain & Webhooks

Nach dem Deployment:

1. **Notiere deine Vercel URL**: https://dein-app-name.vercel.app
2. **Update NEXT_PUBLIC_APP_URL** in Vercel Environment Variables
3. **Stripe Webhook einrichten**:
   - URL: `https://dein-app-name.vercel.app/api/stripe/webhooks`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `account.updated`

## Schritt 7: Custom Domain (Optional)

1. **Domain kaufen** (z.B. bei Namecheap, GoDaddy)
2. **In Vercel**: Project Settings → Domains
3. **Domain hinzufügen** und DNS konfigurieren

## 🔧 Troubleshooting

### Build Fehler
- Überprüfe alle Environment Variables
- Stelle sicher, dass alle Dependencies in package.json sind

### Stripe Fehler
- Verwende Live Keys für Production
- Webhook Secret muss korrekt sein

### Supabase Fehler
- Service Role Key muss korrekt sein
- RLS Policies überprüfen

## 📱 Nach dem Deployment

1. **Teste alle Funktionen**:
   - Registrierung/Login
   - DachBox Upload
   - Stripe Connect Setup
   - Buchungen

2. **Monitoring einrichten**:
   - Vercel Analytics aktivieren
   - Supabase Logs überwachen

3. **Performance optimieren**:
   - Images optimieren
   - Caching konfigurieren

## 🎯 Produktions-Checklist

- [ ] Alle Environment Variables gesetzt
- [ ] Stripe Live Keys aktiviert
- [ ] Domain konfiguriert
- [ ] SSL Zertifikat aktiv
- [ ] Webhooks funktionieren
- [ ] Email Service konfiguriert
- [ ] Backup Strategy definiert
