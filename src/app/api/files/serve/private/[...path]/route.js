import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { withAuth } from '@/main/middleware/authMiddleware'
import { db } from '@/main/db'
import { submissions } from '@/main/db/schema'
import { eq } from 'drizzle-orm'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

async function handleGET(request, { params }) {
  try {
    const { path } = await params
    const publicId = path.join('/')
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('type') || 'image'

    // General file access - if user is authenticated, they can access any private file
    // This is a general file serving endpoint for all authenticated users

    // Generate signed URL for the private file
    const signedUrl = cloudinary.url(publicId, {
      resource_type: resourceType,
      type: 'authenticated',
      sign_url: true,
      secure: true
    })

    // Fetch the file from Cloudinary
    const response = await fetch(signedUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-cache'
      }
    })

  } catch (error) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }
}

// Export protected endpoint
export const GET = withAuth(handleGET)
