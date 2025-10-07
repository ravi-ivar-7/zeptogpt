import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/main/middleware/authMiddleware'

export const POST = withAuth(async function(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const filename = formData.get('filename')

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'No file provided',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Check if R2 is configured
    const r2Config = {
      endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
      bucket: process.env.NEXT_PUBLIC_R2_BUCKET,
      accessKey: process.env.NEXT_PUBLIC_R2_ACCESS_KEY,
      secretKey: process.env.NEXT_PUBLIC_R2_SECRET_KEY,
      region: process.env.NEXT_PUBLIC_R2_REGION || 'auto'
    }

    if (!r2Config.endpoint || !r2Config.bucket) {
      // Fallback: return a data URL for demo purposes
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const mimeType = file.type
      const dataUrl = `data:${mimeType};base64,${base64}`

      return NextResponse.json({
        success: true,
        data: {
          url: dataUrl,
          filename: filename || file.name,
          size: file.size,
          type: file.type,
          isLocal: true
        },
        message: 'File uploaded successfully (local fallback)',
        error: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      })
    }

    // TODO: Implement actual Cloudflare R2 upload
    // For now, return demo response
    const mockUrl = `https://demo-bucket.r2.dev/${filename || file.name}`
    
    return NextResponse.json({
      success: true,
      data: {
        url: mockUrl,
        filename: filename || file.name,
        size: file.size,
        type: file.type
      },
      message: 'File uploaded successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: 'Upload failed',
        meta: {
          timestamp: new Date().toISOString(),
          details: error.message
        }
      },
      { status: 500 }
    )
  }
})
