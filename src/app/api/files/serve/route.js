import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { withAuth } from '@/main/middleware/authMiddleware'

async function handleGET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('file')
    const directory = searchParams.get('dir') || 'general'

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      )
    }

    // Security: Prevent path traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid filename' },
        { status: 400 }
      )
    }

    if (directory.includes('..') || directory.includes('/') || directory.includes('\\')) {
      return NextResponse.json(
        { success: false, error: 'Invalid directory' },
        { status: 400 }
      )
    }

    // Check if user owns this file (filename should contain their email)
    const userEmail = request.user.email
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_')
    
    if (!filename.startsWith(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Access denied - file does not belong to user' },
        { status: 403 }
      )
    }

    // Construct file path
    const uploadsDir = join(process.cwd(), 'uploads')
    const filePath = join(uploadsDir, directory, filename)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      )
    }

    // Read file
    const fileBuffer = await readFile(filePath)
    
    // Determine content type based on file extension
    const extension = filename.split('.').pop().toLowerCase()
    const contentTypeMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'json': 'application/json',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav'
    }

    const contentType = contentTypeMap[extension] || 'application/octet-stream'

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('File serve error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to serve file' },
      { status: 500 }
    )
  }
}

// Export protected endpoint
export const GET = withAuth(handleGET)
