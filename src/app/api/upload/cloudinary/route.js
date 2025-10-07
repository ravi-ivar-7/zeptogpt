import { NextResponse } from 'next/server'
import { cloudinaryUpload } from '@/main/services/upload/cloudinary'
import { withAuth } from '@/main/middleware/authMiddleware'

async function handlePOST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'uploads'
    const tags = formData.get('tags') ? formData.get('tags').split(',') : []
    const transformation = formData.get('transformation') ? JSON.parse(formData.get('transformation')) : {}
    const deliveryType = formData.get('deliveryType') || 'private'

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

    const result = await cloudinaryUpload.uploadFile(file, {
      folder,
      tags,
      transformation,
      deliveryType
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
    const { publicId, resourceType = 'image' } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No public ID provided'
        },
        { status: 400 }
      )
    }

    const result = await cloudinaryUpload.deleteFile(publicId, resourceType, 'private')

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
    message: 'Cloudinary Upload API is working',
    configured: cloudinaryUpload.isConfigured(),
    endpoints: {
      POST: 'Upload file to Cloudinary',
      DELETE: 'Delete file from Cloudinary'
    },
    maxFileSize: '100MB',
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/mov', 'video/avi',
      'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf'
    ]
  })
}

// Export protected endpoints
export { GET }
export const POST = withAuth(handlePOST)
export const DELETE = withAuth(handleDELETE)
