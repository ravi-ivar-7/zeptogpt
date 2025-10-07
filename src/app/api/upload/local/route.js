import { NextResponse } from 'next/server'
import { localUpload } from '@/main/services/upload/local'
import { withAuth } from '@/main/middleware/authMiddleware'

async function handlePOST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const subDirectory = formData.get('subDirectory') || 'general'
    const preserveOriginalName = formData.get('preserveOriginalName') === 'true'
    const intent = formData.get('intent') || 'general'

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
          data: null
        },
        { status: 400 }
      )
    }

    const result = await localUpload.uploadFile(file, {
      subDirectory,
      preserveOriginalName,
      userEmail: request.user.email,
      intent
    })

    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        data: null
      },
      { status: 500 }
    )
  }
}

async function handleDELETE(request) {
  try {
    const { filename, directory = 'general' } = await request.json()

    if (!filename) {
      return NextResponse.json(
        {
          success: false,
          error: 'No filename provided'
        },
        { status: 400 }
      )
    }

    // Security: Check if user owns this file
    const userEmail = request.user.email
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_')
    
    if (!filename.startsWith(sanitizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied - file does not belong to user'
        },
        { status: 403 }
      )
    }

    const result = await localUpload.deleteFile(filename, directory)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Local Upload API is working',
    endpoints: {
      POST: 'Upload file to local storage',
      DELETE: 'Delete file from local storage'
    },
    maxFileSize: '10MB',
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'text/plain', 'application/json',
      'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav'
    ]
  })
}

// Export protected endpoints
export { GET }
export const POST = withAuth(handlePOST)
export const DELETE = withAuth(handleDELETE)
