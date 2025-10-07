import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Cloudflare R2 Upload Service
 * Uses S3-compatible API for Cloudflare R2 storage
 */
export class CloudflareUploadService {
  constructor() {
    this.config = {
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      bucket: process.env.CLOUDFLARE_R2_BUCKET,
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
      region: process.env.CLOUDFLARE_R2_REGION || 'auto',
      publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL
    }

    this.maxFileSize = 100 * 1024 * 1024 // 100MB
    this.allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'text/plain', 'application/json',
      'video/mp4', 'video/webm', 'video/mov', 'video/avi',
      'audio/mp3', 'audio/wav', 'audio/ogg'
    ]

    // Initialize S3 client for R2
    this.s3Client = null
    this.initializeClient()
  }

  /**
   * Initialize S3 client for Cloudflare R2
   */
  initializeClient() {
    if (!this.config.endpoint || !this.config.accessKeyId) {
      console.warn('Cloudflare R2 credentials not configured')
      return
    }

    this.s3Client = new S3Client({
      region: this.config.region,
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    })
  }

  /**
   * Check if service is configured
   */
  isConfigured() {
    return this.s3Client !== null && this.config.bucket
  }

  /**
   * Validate uploaded file
   */
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`File size must be less than ${this.maxFileSize / 1024 / 1024}MB`)
    }

    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`)
    }

    return true
  }

  /**
   * Generate unique key for R2
   */
  generateKey(originalName, folder = '') {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`
    
    return folder ? `${folder}/${filename}` : filename
  }

  /**
   * Upload file to Cloudflare R2
   */
  async uploadFile(file, options = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Cloudflare R2 not configured')
      }

      // Validate file
      this.validateFile(file)

      // Extract options
      const {
        folder = 'uploads',
        makePublic = true,
        customKey = null
      } = options

      // Generate key
      const key = customKey || this.generateKey(file.name, folder)

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Prepare upload command
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: file.size,
        Metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      })

      // Upload to R2
      const result = await this.s3Client.send(command)

      // Generate public URL
      const publicUrl = this.config.publicUrl 
        ? `${this.config.publicUrl}/${key}`
        : `${this.config.endpoint}/${this.config.bucket}/${key}`

      return {
        success: true,
        data: {
          key,
          filename: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          etag: result.ETag,
          folder,
          provider: 'cloudflare-r2'
        },
        message: 'File uploaded successfully to Cloudflare R2'
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(files, options = {}) {
    const results = []
    
    for (const file of files) {
      const result = await this.uploadFile(file, options)
      results.push(result)
    }

    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    return {
      success: failed.length === 0,
      data: {
        uploaded: successful,
        failed: failed,
        total: files.length,
        successCount: successful.length,
        failureCount: failed.length
      },
      message: `${successful.length}/${files.length} files uploaded to Cloudflare R2`
    }
  }

  /**
   * Generate presigned URL for direct upload
   */
  async generatePresignedUrl(key, options = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Cloudflare R2 not configured')
      }

      const {
        expiresIn = 3600, // 1 hour
        contentType = 'application/octet-stream'
      } = options

      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        ContentType: contentType
      })

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn
      })

      return {
        success: true,
        data: {
          uploadUrl: signedUrl,
          key,
          expiresIn,
          method: 'PUT'
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Cloudflare R2 not configured')
      }

      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key
      })

      await this.s3Client.send(command)

      return {
        success: true,
        message: 'File deleted successfully from Cloudflare R2'
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get file metadata
   */
  async getFileInfo(key) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Cloudflare R2 not configured')
      }

      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key
      })

      const result = await this.s3Client.send(command)

      return {
        success: true,
        data: {
          key,
          size: result.ContentLength,
          type: result.ContentType,
          lastModified: result.LastModified,
          etag: result.ETag,
          metadata: result.Metadata
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Export singleton instance
export const cloudflareUpload = new CloudflareUploadService()
