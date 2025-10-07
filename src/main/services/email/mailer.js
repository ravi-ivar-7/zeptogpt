import nodemailer from 'nodemailer'

export class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NOTIFICATION_EMAIL_ADDRESS,
        pass: process.env.NOTIFICATION_EMAIL_PASSWORD,
      },
    })
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}" <${process.env.NOTIFICATION_EMAIL_ADDRESS}>`,
        to: to,
        subject: subject,
        html: html
      }

      const result = await this.transporter.sendMail(mailOptions)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}

export const mailService = new MailService()
