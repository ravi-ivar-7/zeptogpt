import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * Local File Upload Service
 * Saves files to the public/uploads directory
 */
export class LocalUploadService {
  constructor() {
    this.uploadDir = join(process.cwd(), 'uploads') // Private directory outside public
    this.maxFileSize = 10 * 1024 * 1024 // 10MB
    this.allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'text/plain', 'application/json',
      'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav'
    ]
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
   * Generate user-specific filename with email and intent
   */
  generateFilename(originalName, userEmail, intent = 'general') {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_')
    const sanitizedIntent = intent.replace(/[^a-zA-Z0-9]/g, '_')
    return `${sanitizedEmail}_${sanitizedIntent}_${timestamp}_${randomString}.${extension}`
  }

  /**
   * Ensure upload directory exists
   */
  async ensureUploadDir(subDir = '') {
    const targetDir = subDir ? join(this.uploadDir, subDir) : this.uploadDir
    
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }
    
    return targetDir
  }

  /**
   * Upload file to local storage
   */
  async uploadFile(file, options = {}) {
    try {
      // Validate file
      this.validateFile(file)

      // Extract options - now requires user info
      const { 
        subDirectory = 'general',
        preserveOriginalName = false,
        customFilename = null,
        userEmail,
        intent = 'general'
      } = options

      if (!userEmail) {
        throw new Error('User email is required for file uploads')
      }

      // Ensure directory exists
      const uploadPath = await this.ensureUploadDir(subDirectory)

      // Generate filename
      let filename
      if (customFilename) {
        filename = customFilename
      } else if (preserveOriginalName) {
        filename = file.name
      } else {
        filename = this.generateFilename(file.name, userEmail, intent)
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Write file
      const filePath = join(uploadPath, filename)
      await writeFile(filePath, buffer)

      // Return file info with protected URL
      const protectedUrl = `/api/files/serve?file=${encodeURIComponent(filename)}&dir=${encodeURIComponent(subDirectory)}`
      
      return {
        success: true,
        data: {
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          url: protectedUrl,
          path: filePath,
          directory: subDirectory,
          userEmail,
          intent
        },
        message: 'File uploaded successfully to secure storage'
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
      message: `${successful.length}/${files.length} files uploaded successfully`
    }
  }

  /**
   * Get file info by filename and directory
   */
  getFileInfo(filename, directory = 'general') {
    const fullPath = join(this.uploadDir, directory, filename)

    return {
      filename,
      directory,
      fullPath,
      exists: existsSync(fullPath),
      url: `/api/files/serve?file=${encodeURIComponent(filename)}&dir=${encodeURIComponent(directory)}`
    }
  }

  /**
   * Delete file by filename and directory
   */
  async deleteFile(filename, directory = 'general') {
    try {
      const fileInfo = this.getFileInfo(filename, directory)
      
      if (!fileInfo.exists) {
        throw new Error('File not found')
      }

      const fs = await import('fs/promises')
      await fs.unlink(fileInfo.fullPath)

      return {
        success: true,
        message: 'File deleted successfully'
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
export const localUpload = new LocalUploadService()
