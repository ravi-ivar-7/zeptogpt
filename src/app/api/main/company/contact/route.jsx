import { NextResponse } from 'next/server';
import { mailService } from '@/main/services/email/mailer';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export async function POST(request) {
  try {
    const { name, email, subject, message, priority } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'All fields are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Please provide a valid email address',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      priority: sanitizeInput(priority) || 'normal'
    };

    if (sanitizedData.name.length < 2 || sanitizedData.name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Name must be between 2 and 100 characters',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    if (sanitizedData.subject.length < 5 || sanitizedData.subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Subject must be between 5 and 200 characters',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    if (sanitizedData.message.length < 10 || sanitizedData.message.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Message must be between 10 and 2000 characters',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (!validPriorities.includes(sanitizedData.priority)) {
      sanitizedData.priority = 'normal';
    }

    const priorityConfig = {
      low: { emoji: '🟢', color: '#10B981' },
      normal: { emoji: '🟡', color: '#F59E0B' },
      high: { emoji: '🟠', color: '#F97316' },
      urgent: { emoji: '🔴', color: '#EF4444' }
    };

    const currentPriority = priorityConfig[sanitizedData.priority];

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
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
                    <h1 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">📧 New Contact Message</h1>
                    <p style="margin: 0; color: #cccccc !important; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Someone reached out through <span style="color: #06b6d4 !important; font-weight: 700;">${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</span></p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 16px; background-color: #0a0a0a !important;">
                    
                    <!-- Priority Badge -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="display: inline-block; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 11px; background-color: ${currentPriority.color}; color: white !important; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${currentPriority.emoji} ${sanitizedData.priority} Priority
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Contact Name -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px; background-color: #1a1a1a !important; border: 1px solid #333333; border-radius: 8px;">
                      <tr>
                        <td style="padding: 12px;">
                          <div style="margin-bottom: 6px; font-weight: 600; color: #cccccc !important; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            👤 Contact Name
                          </div>
                          <div style="color: #ffffff !important; font-size: 14px; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${sanitizedData.name}</div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Email Address -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px; background-color: #1a1a1a !important; border: 1px solid #333333; border-radius: 8px;">
                      <tr>
                        <td style="padding: 12px;">
                          <div style="margin-bottom: 6px; font-weight: 600; color: #cccccc !important; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            📧 Email Address
                          </div>
                          <div style="color: #ffffff !important; font-size: 14px; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${sanitizedData.email}</div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Subject -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 12px; background-color: #1a1a1a !important; border: 1px solid #333333; border-radius: 8px;">
                      <tr>
                        <td style="padding: 12px;">
                          <div style="margin-bottom: 6px; font-weight: 600; color: #cccccc !important; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            📝 Subject
                          </div>
                          <div style="color: #ffffff !important; font-size: 14px; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${sanitizedData.subject}</div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Message -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a !important; border: 1px solid #333333; border-radius: 8px;">
                      <tr>
                        <td style="padding: 14px;">
                          <div style="margin-bottom: 6px; font-weight: 600; color: #cccccc !important; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            💬 Message
                          </div>
                          <div style="color: #ffffff !important; font-size: 14px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${sanitizedData.message.replace(/\n/g, '<br>')}</div>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 12px 16px; border-top: 1px solid #333333; background-color: #111111 !important; text-align: center;">
                    <p style="margin: 0; color: #cccccc !important; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Sent from <span style="color: #06b6d4 !important; font-weight: 700;">${process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}</span> contact form</p>
                    <div style="color: #999999 !important; font-size: 10px; margin-top: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${new Date().toLocaleString()}</div>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `;

    try {
      const contactEmail = process.env.CONTACT_EMAIL_ADDRESS || process.env.NOTIFICATION_EMAIL_ADDRESS;
      const subject = `[${sanitizedData.priority.toUpperCase()}] ${sanitizedData.subject}`;

      await mailService.sendEmail(contactEmail, subject, emailHtml);
      console.log('Contact form email sent successfully');

    } catch (error) {
      console.log(error, 'error sending contact mail')
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          contactId: `contact_${Date.now()}`,
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          priority: sanitizedData.priority
        },
        message: 'Thank you for your message! We\'ll get back to you soon.',
        error: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: error.message || 'Something went wrong. Please try again later.',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        endpoint: 'Contact API',
        methods: ['POST'],
        status: 'operational'
      },
      message: 'Contact API endpoint is working',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    },
    { status: 200 }
  );
}