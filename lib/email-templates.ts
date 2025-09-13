// Email templates for DachBox platform

export interface BookingConfirmationData {
  renterName: string
  landlordName: string
  dachboxTitle: string
  dachboxLocation: string
  startDate: string
  endDate: string
  totalDays: number
  totalAmount: number
  landlordEmail: string
  landlordPhone: string
  renterEmail: string
  renterPhone: string
  bookingId: string
}

export interface ReviewReminderData {
  renterName: string
  renterEmail: string
  dachboxTitle: string
  landlordName: string
  bookingId: string
  reviewUrl: string
}

export const generateBookingConfirmationEmailForRenter = (data: BookingConfirmationData) => {
  return {
    subject: `Buchungsbestätigung - ${data.dachboxTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .contact-info { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Buchung bestätigt! 🎉</h1>
            <p>Deine DachBox-Buchung wurde erfolgreich abgeschlossen</p>
          </div>
          
          <div class="content">
            <p>Hallo ${data.renterName},</p>
            
            <p>deine Zahlung wurde erfolgreich verarbeitet und deine Buchung ist bestätigt!</p>
            
            <div class="booking-details">
              <h3>📦 Buchungsdetails</h3>
              <p><strong>DachBox:</strong> ${data.dachboxTitle}</p>
              <p><strong>Standort:</strong> ${data.dachboxLocation}</p>
              <p><strong>Zeitraum:</strong> ${new Date(data.startDate).toLocaleDateString('de-DE')} - ${new Date(data.endDate).toLocaleDateString('de-DE')}</p>
              <p><strong>Dauer:</strong> ${data.totalDays} Tage</p>
              <p><strong>Gesamtbetrag:</strong> ${data.totalAmount / 100}€</p>
              <p><strong>Buchungs-ID:</strong> ${data.bookingId}</p>
            </div>
            
            <div class="contact-info">
              <h3>📞 Kontaktdaten des Vermieters</h3>
              <p><strong>Name:</strong> ${data.landlordName}</p>
              <p><strong>E-Mail:</strong> <a href="mailto:${data.landlordEmail}">${data.landlordEmail}</a></p>
              <p><strong>Telefon:</strong> <a href="tel:${data.landlordPhone}">${data.landlordPhone}</a></p>
              
              <p><em>💡 Tipp: Kontaktiere den Vermieter mindestens 24 Stunden vor der Abholung, um den genauen Treffpunkt und die Uhrzeit zu vereinbaren.</em></p>
            </div>
            
            <h3>📋 Nächste Schritte:</h3>
            <ol>
              <li>Kontaktiere den Vermieter für die Abholdetails</li>
              <li>Prüfe die DachBox bei der Abholung auf Vollständigkeit</li>
              <li>Genieße dein Abenteuer! 🚗</li>
              <li>Gib nach der Rückgabe eine Bewertung ab</li>
            </ol>
            
            <p>Bei Fragen oder Problemen kannst du uns jederzeit kontaktieren.</p>
            
            <p>Viel Spaß mit deiner DachBox!</p>
            <p>Dein DachBox-Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 DachBox - Dachboxen mieten leicht gemacht</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export const generateBookingConfirmationEmailForLandlord = (data: BookingConfirmationData) => {
  return {
    subject: `Neue Buchung erhalten - ${data.dachboxTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .contact-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .earnings { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Neue Buchung! 💰</h1>
            <p>Deine DachBox wurde gebucht</p>
          </div>
          
          <div class="content">
            <p>Hallo ${data.landlordName},</p>
            
            <p>großartige Neuigkeiten! Deine DachBox wurde erfolgreich gebucht und die Zahlung ist eingegangen.</p>
            
            <div class="booking-details">
              <h3>📦 Buchungsdetails</h3>
              <p><strong>DachBox:</strong> ${data.dachboxTitle}</p>
              <p><strong>Zeitraum:</strong> ${new Date(data.startDate).toLocaleDateString('de-DE')} - ${new Date(data.endDate).toLocaleDateString('de-DE')}</p>
              <p><strong>Dauer:</strong> ${data.totalDays} Tage</p>
              <p><strong>Buchungs-ID:</strong> ${data.bookingId}</p>
            </div>
            
            <div class="earnings">
              <h3>💰 Deine Einnahmen</h3>
              <p><strong>Gesamtbetrag:</strong> ${data.totalAmount / 100}€</p>
              <p><strong>Plattformgebühr (10%):</strong> -${Math.round(data.totalAmount * 0.1) / 100}€</p>
              <p><strong>Deine Auszahlung:</strong> ${Math.round(data.totalAmount * 0.9) / 100}€</p>
              <p><em>Die Auszahlung erfolgt automatisch nach erfolgreicher Rückgabe der DachBox.</em></p>
            </div>
            
            <div class="contact-info">
              <h3>📞 Kontaktdaten des Mieters</h3>
              <p><strong>Name:</strong> ${data.renterName}</p>
              <p><strong>E-Mail:</strong> <a href="mailto:${data.renterEmail}">${data.renterEmail}</a></p>
              <p><strong>Telefon:</strong> <a href="tel:${data.renterPhone}">${data.renterPhone}</a></p>
              
              <p><em>Der Mieter wird sich in Kürze bei dir melden, um die Abholdetails zu besprechen.</em></p>
            </div>
            
            <h3>📋 Nächste Schritte:</h3>
            <ol>
              <li>Warte auf die Kontaktaufnahme des Mieters</li>
              <li>Vereinbare einen Abholtermin und -ort</li>
              <li>Stelle sicher, dass die DachBox sauber und vollständig ist</li>
              <li>Übergabe der DachBox am vereinbarten Termin</li>
            </ol>
            
            <p>Vielen Dank, dass du Teil der DachBox-Community bist!</p>
            <p>Dein DachBox-Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 DachBox - Dachboxen mieten leicht gemacht</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export const generateReviewReminderEmail = (data: ReviewReminderData) => {
  return {
    subject: `Wie war deine Erfahrung mit ${data.dachboxTitle}?`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .review-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
          .stars { font-size: 24px; color: #fbbf24; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bewertung abgeben ⭐</h1>
            <p>Teile deine Erfahrung mit anderen</p>
          </div>
          
          <div class="content">
            <p>Hallo ${data.renterName},</p>
            
            <p>wir hoffen, du hattest eine großartige Zeit mit der DachBox von ${data.landlordName}!</p>
            
            <div class="review-box">
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <h3>Wie war deine Erfahrung?</h3>
              <p>Deine Bewertung hilft anderen Nutzern bei der Auswahl und unterstützt ${data.landlordName}.</p>
              
              <a href="${data.reviewUrl}" class="button">Jetzt bewerten</a>
            </div>
            
            <p>Die Bewertung dauert nur wenige Minuten und ist eine große Hilfe für unsere Community.</p>
            
            <p>Vielen Dank für die Nutzung von DachBox!</p>
            <p>Dein DachBox-Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 DachBox - Dachboxen mieten leicht gemacht</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}
