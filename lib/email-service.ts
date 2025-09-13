// Email service for sending notifications
import { supabase } from './supabase-client'
import { 
  generateBookingConfirmationEmailForRenter, 
  generateBookingConfirmationEmailForLandlord,
  generateReviewReminderEmail,
  BookingConfirmationData,
  ReviewReminderData
} from './email-templates'

// In a production environment, you would use a service like SendGrid, Mailgun, or AWS SES
// For now, we'll simulate email sending and log to database

export async function sendBookingConfirmationEmails(bookingData: BookingConfirmationData) {
  try {
    // Generate emails
    const renterEmail = generateBookingConfirmationEmailForRenter(bookingData)
    const landlordEmail = generateBookingConfirmationEmailForLandlord(bookingData)

    // In production, send actual emails here
    // await sendEmail(bookingData.renterEmail, renterEmail.subject, renterEmail.html)
    // await sendEmail(bookingData.landlordEmail, landlordEmail.subject, landlordEmail.html)

    // Log emails to database
    const emailLogs = [
      {
        recipient_email: bookingData.renterEmail,
        email_type: 'booking_confirmation',
        booking_id: bookingData.bookingId,
        subject: renterEmail.subject,
        template_data: bookingData,
        status: 'sent',
        sent_at: new Date().toISOString()
      },
      {
        recipient_email: bookingData.landlordEmail,
        email_type: 'booking_confirmation',
        booking_id: bookingData.bookingId,
        subject: landlordEmail.subject,
        template_data: bookingData,
        status: 'sent',
        sent_at: new Date().toISOString()
      }
    ]

    const { error } = await supabase
      .from('email_logs')
      .insert(emailLogs)

    if (error) {
      console.error('Error logging emails:', error)
      throw error
    }

    console.log('Booking confirmation emails sent successfully')
    return true
  } catch (error) {
    console.error('Error sending booking confirmation emails:', error)
    throw error
  }
}

export async function sendReviewReminderEmail(reminderData: ReviewReminderData) {
  try {
    const email = generateReviewReminderEmail(reminderData)

    // In production, send actual email here
    // await sendEmail(reminderData.renterEmail, email.subject, email.html)

    // Log email to database
    const { error } = await supabase
      .from('email_logs')
      .insert({
        recipient_email: reminderData.renterEmail,
        email_type: 'review_reminder',
        booking_id: reminderData.bookingId,
        subject: email.subject,
        template_data: reminderData,
        status: 'sent',
        sent_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging review reminder email:', error)
      throw error
    }

    console.log('Review reminder email sent successfully')
    return true
  } catch (error) {
    console.error('Error sending review reminder email:', error)
    throw error
  }
}

export async function scheduleReviewReminder(bookingId: string, endDate: string) {
  // In a production environment, you would use a job queue or cron job
  // For now, we'll simulate scheduling by calculating when to send the reminder
  
  const reminderDate = new Date(endDate)
  reminderDate.setDate(reminderDate.getDate() + 1) // Send reminder 1 day after rental ends
  
  console.log(`Review reminder scheduled for booking ${bookingId} on ${reminderDate.toISOString()}`)
  
  // In production, you would add this to a job queue:
  // await addToJobQueue('send_review_reminder', { bookingId }, reminderDate)
  
  return true
}

// Simulated email sending function
// In production, replace this with actual email service integration
async function sendEmail(to: string, subject: string, html: string) {
  console.log(`📧 Email sent to: ${to}`)
  console.log(`📧 Subject: ${subject}`)
  console.log(`📧 Content: ${html.substring(0, 100)}...`)
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return true
}
