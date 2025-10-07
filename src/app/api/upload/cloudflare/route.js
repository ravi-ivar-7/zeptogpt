import { NextResponse } from 'next/server'
import { cloudflareUpload } from '@/main/services/upload/cloudflare'
import { withAuth } from '@/main/middleware/authMiddleware'

async function handlePOST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'uploads'
    const makePublic = formData.get('makePublic') !== 'false'

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

    const result = await cloudflareUpload.uploadFile(file, {
      folder,
      makePublic
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
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          error: 'No key provided'
        },
        { status: 400 }
      )
    }

    const result = await cloudflareUpload.deleteFile(key)

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
    message: 'Cloudflare R2 Upload API is working',
    configured: cloudflareUpload.isConfigured(),
    endpoints: {
      POST: 'Upload file to Cloudflare R2',
      DELETE: 'Delete file from Cloudflare R2'
    },
    maxFileSize: '100MB',
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'text/plain', 'application/json',
      'video/mp4', 'video/webm', 'video/mov', 'video/avi',
      'audio/mp3', 'audio/wav', 'audio/ogg'
    ]
  })
}

// Export protected endpoints
export { GET }
export const POST = withAuth(handlePOST)
export const DELETE = withAuth(handleDELETE)
