import { NextResponse } from 'next/server'
import { db } from '@/main/db'
import { submissions } from '@/main/db/schema'
import { eq, desc } from 'drizzle-orm'
import { withAdminAuth } from '@/main/middleware/authMiddleware'
import { cloudinaryUpload } from '@/main/services/upload/cloudinary'

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

// Upload file to Cloudinary
const uploadFileToCloudinary = async (file, type) => {
  const result = await cloudinaryUpload.uploadFile(file, {
    folder: `submissions/${type}`,
    deliveryType: 'private', // Private files for submissions
    tags: ['submission', type]
  })
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  return {
    filename: file.name,
    url: result.data.url,
    publicId: result.data.publicId,
    size: file.size,
    type: file.type,
    provider: 'cloudinary'
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const type = formData.get('type')
    const email = formData.get('email')
    const name = formData.get('name') || ''
    const subject = formData.get('subject') || ''
    const message = formData.get('message') || ''
    const metadata = formData.get('metadata') || '{}'
    
    // Validate required fields
    if (!type || !email) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Type and email are required',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }
    
    // Validate submission type
    const validTypes = ['bug_report', 'feedback', 'email_subscription', 'feature_request', 'general']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid submission type',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Please provide a valid email address',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }
    
    // Sanitize inputs
    const sanitizedData = {
      type: sanitizeInput(type),
      email: sanitizeInput(email),
      name: sanitizeInput(name),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      metadata: {}
    }
    
    // Parse metadata
    try {
      sanitizedData.metadata = JSON.parse(metadata)
    } catch (error) {
      sanitizedData.metadata = {}
    }

    // Length validations
    if (sanitizedData.name && (sanitizedData.name.length < 2 || sanitizedData.name.length > 100)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Name must be between 2 and 100 characters',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }

    if (sanitizedData.subject && (sanitizedData.subject.length < 5 || sanitizedData.subject.length > 500)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Subject must be between 5 and 500 characters',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }

    if (sanitizedData.message && (sanitizedData.message.length < 10 || sanitizedData.message.length > 2000)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Message must be between 10 and 2000 characters',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }
    
    // Handle file uploads to Cloudinary
    const attachments = []
    const files = formData.getAll('files')
    
    for (const file of files) {
      if (file && file.size > 0) {
        try {
          const uploadedFile = await uploadFileToCloudinary(file, type)
          attachments.push(uploadedFile)
        } catch (error) {
          return NextResponse.json(
            {
              success: false,
              data: null,
              message: null,
              error: `File upload error: ${error.message}`,
              meta: { timestamp: new Date().toISOString() }
            },
            { status: 400 }
          )
        }
      }
    }
    
    // Create submission object
    const submission = {
      type: sanitizedData.type,
      email: sanitizedData.email,
      name: sanitizedData.name,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      metadata: sanitizedData.metadata,
      attachments: attachments,
      status: 'pending'
    }
    
    // Save to database
    const [insertedSubmission] = await db.insert(submissions).values(submission).returning()
    
    // Type-specific responses
    const responses = {
      email_subscription: 'Thank you for subscribing! We\'ll keep you updated.',
      bug_report: 'Bug report received. We\'ll investigate this issue.',
      feedback: 'Thank you for your feedback! We appreciate your input.',
      feature_request: 'Feature request received. We\'ll consider it for future updates.',
      general: 'Submission received. Thank you for reaching out.'
    }
    
    return NextResponse.json(
      {
        success: true,
        data: {
          submissionId: insertedSubmission.id,
          type: insertedSubmission.type,
          email: insertedSubmission.email,
          name: insertedSubmission.name,
          subject: insertedSubmission.subject,
          attachments: attachments.length
        },
        message: responses[type] || responses.general,
        error: null,
        meta: { timestamp: new Date().toISOString() }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Submissions API error:', error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: error.message || 'Something went wrong. Please try again later.',
        meta: { timestamp: new Date().toISOString() }
      },
      { status: 500 }
    )
  }
}

const getSubmissions = async (request) => {
  try {
    // Fetch all submissions ordered by creation date (newest first)
    const allSubmissions = await db
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt))

    return NextResponse.json(
      {
        success: true,
        data: {
          submissions: allSubmissions,
          count: allSubmissions.length
        },
        message: 'Submissions retrieved successfully',
        error: null,
        meta: { timestamp: new Date().toISOString() }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching submissions:', error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: 'Failed to fetch submissions',
        meta: { timestamp: new Date().toISOString() }
      },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(getSubmissions)

const updateSubmission = async (request) => {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'ID and status are required',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }
    
    const validStatuses = ['pending', 'in_progress', 'resolved', 'closed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid status',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 400 }
      )
    }
    
    const [updatedSubmission] = await db
      .update(submissions)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id))
      .returning()
    
    if (!updatedSubmission) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Submission not found',
          meta: { timestamp: new Date().toISOString() }
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      {
        success: true,
        data: updatedSubmission,
        message: 'Submission status updated successfully',
        error: null,
        meta: { timestamp: new Date().toISOString() }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating submission:', error)
    
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: 'Failed to update submission',
        meta: { timestamp: new Date().toISOString() }
      },
      { status: 500 }
    )
  }
}

export const PATCH = withAdminAuth(updateSubmission)
