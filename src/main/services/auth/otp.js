import { db } from '@/main/db'
import { verificationTokens } from '@/main/db'
import { eq, gt, and, desc } from 'drizzle-orm'
import { mailService } from '@/main/services/email/mailer' 
import crypto from 'crypto'

// Rate limiting function for OTP requests
export async function checkOtpRateLimit(email, intent) {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
  const [recentOTP] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.email, email),
        eq(verificationTokens.type, intent),
        gt(verificationTokens.createdAt, twoMinutesAgo)
      )
    )
    .orderBy(desc(verificationTokens.createdAt))
    .limit(1)

  if (recentOTP) {
    const timeLeftSeconds = Math.ceil((recentOTP.createdAt.getTime() + 120000 - Date.now()) / 1000)
    const minutes = Math.floor(timeLeftSeconds / 60)
    const seconds = timeLeftSeconds % 60
    
    const timeMessage = minutes > 0 
      ? `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`
      : `${seconds} second${seconds !== 1 ? 's' : ''}`
    
    return {
      isRateLimited: true,
      timeLeftSeconds,
      timeMessage
    }
  }

  return { isRateLimited: false }
}

export async function verifyOTP(email, otp, intent) {
  try {
    const tokenRecord = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.email, email),
          eq(verificationTokens.token, otp),
          eq(verificationTokens.type, intent),
          eq(verificationTokens.isUsed, false),
          gt(verificationTokens.expiresAt, new Date())
        )
      )
      .limit(1)

    if (tokenRecord.length === 0) return false

    await db
      .update(verificationTokens)
      .set({
        isUsed: true,
        usedAt: new Date()
      })
      .where(eq(verificationTokens.id, tokenRecord[0].id))

    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

export async function generateAndSendOTP(email, intent, ipAddress = null) {
  try {
    // Check rate limiting first
    const rateLimitResult = await checkOtpRateLimit(email, intent)
    if (rateLimitResult.isRateLimited) {
      return {
        success: false,
        error: `Please wait ${rateLimitResult.timeMessage} before requesting another OTP`,
        rateLimited: true,
        timeLeft: rateLimitResult.timeLeftSeconds,
        timeLeftFormatted: rateLimitResult.timeMessage
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    await db.insert(verificationTokens).values({
      id: crypto.randomUUID(),
      email: email,
      token: otp,
      type: intent,
      expiresAt: expiresAt,
      isUsed: false,
      createdAt: new Date()
    })

    // Send OTP email
    await sendOTP(email, otp, intent, ipAddress)

    return { success: true, message: 'OTP sent successfully' }
  } catch (error) {
    console.error('Error generating and sending OTP:', error)
    throw error
  }
}

export async function sendOTP(email, otp, intent = 'verification', ipAddress = null) {
  console.log('sending otp email for ', email)
  const intentMessages = {
    'account_activation_otp': 'Complete your registration',
    'email_verification_otp': 'Verify your email address',
    '2fa_otp': 'Two-factor authentication code',
    'password_reset_otp': 'Reset your password'
  }

  const message = intentMessages[intent] || 'Verify your account'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'} - ${message}</title>
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
    </head>
    <body style="margin: 0 !important; padding: 0 !important; background-color: #000000 !important; color: #ffffff !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; line-height: 1.6 !important; width: 100% !important; height: 100% !important;">
      
      <!-- Outer wrapper table for email client compatibility -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #000000 !important; width: 100%; height: 100%;">
        <tr>
          <td style="background-color: #000000 !important; padding: 10px;">
            
            <!-- Main container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #111111 !important; border: 2px solid #7c3aed; border-radius: 12px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #333333; text-align: center; background-color: #0a0a0a !important;">
                  <h1 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${message}</h1>
                  <p style="margin: 0; color: #cccccc !important; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Secure access to <span style="color: #06b6d4 !important; font-weight: 700;">${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</span></p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 16px; text-align: center; background-color: #0a0a0a !important;">
                  
                  <!-- Verification Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a !important; border: 1px solid #333333; border-radius: 8px; margin: 8px 0;">
                    <tr>
                      <td style="padding: 20px 16px; text-align: center;">
                        
                        <div style="color: #cccccc !important; font-size: 16px; font-weight: 600; margin-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Your Verification Code</div>
                        <div style="color: #999999 !important; font-size: 13px; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Enter this code to continue securely</div>
                        
                        <!-- OTP Code -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 12px auto;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: white !important; font-size: 28px; font-weight: 700; letter-spacing: 4px; padding: 16px 20px; border-radius: 8px; text-align: center; font-family: 'Courier New', monospace;">
                              ${otp}
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Warning Box -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d1b1b !important; border: 1px solid #4a2626; border-radius: 8px; margin-top: 16px;">
                          <tr>
                            <td style="padding: 12px; text-align: center;">
                              <div style="color: #ffcccc !important; font-size: 12px; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ⚠️ <strong>Security Notice:</strong><br>
                                This code expires in <strong>10 minutes</strong><br>
                                If you didn't request this verification, please ignore this email
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        ${ipAddress ? `
                          <!-- Security Info -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a !important; border: 1px solid #333333; border-radius: 8px; margin-top: 12px;">
                            <tr>
                              <td style="padding: 10px; text-align: center;">
                                <div style="color: #999999 !important; font-size: 10px; font-family: 'Courier New', monospace;">
                                  📍 Request origin: ${ipAddress}
                                </div>
                              </td>
                            </tr>
                          </table>
                        ` : ''}
                        
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 12px 16px; border-top: 1px solid #333333; background-color: #111111 !important; text-align: center;">
                  <p style="margin: 0; color: #cccccc !important; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">© 2025 <span style="color: #06b6d4 !important; font-weight: 700;">${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</span>. All rights reserved.</p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `
  const subject = `Your ${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'} code: ${otp}`

  return await mailService.sendEmail(email, subject, html)
}
