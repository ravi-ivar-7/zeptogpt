import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export class CloudinaryUploadService {
  async uploadFile(file, options = {}) {
    try {
      if (!file) throw new Error('No file provided')
      if (file.size > 100 * 1024 * 1024) throw new Error('File too large (max 100MB)')

      const folder = options.folder || 'uploads'
      const deliveryType = options.deliveryType || 'private'
      const tags = options.tags || []
      const transformation = options.transformation || {}
      const accessControl = options.accessControl 
      const context = options.context || {}
      const metadata = options.metadata || {}
      const overwrite = options.overwrite || false
      const uniqueFilename = options.uniqueFilename !== undefined ? options.uniqueFilename : true
      const useFilename = options.useFilename || false
      const notification_url = options.notification_url
      const eager = options.eager
      const backup = options.backup || false
      const returnDeleteToken = options.returnDeleteToken || false
      
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`
      
      const resourceType = file.type.startsWith('image/') ? 'image' : 
                          file.type.startsWith('video/') ? 'video' : 'raw'

      const uploadOptions = {
        folder,
        resource_type: resourceType,
        type: deliveryType === 'upload' ? 'upload' : 'authenticated',
        tags: ['upload', ...tags],
        overwrite,
        unique_filename: uniqueFilename,
        use_filename: useFilename,
        backup,
        return_delete_token: returnDeleteToken
      }

      // Add access control if provided
      if (accessControl) {
        uploadOptions.access_control = accessControl
      }

      // Add context if provided
      if (Object.keys(context).length > 0) {
        uploadOptions.context = context
      }

      // Add metadata if provided  
      if (Object.keys(metadata).length > 0) {
        uploadOptions.metadata = metadata
      }

      // Add transformation if provided
      if (Object.keys(transformation).length > 0) {
        uploadOptions.transformation = transformation
      }

      // Add notification URL if provided
      if (notification_url) {
        uploadOptions.notification_url = notification_url
      }

      // Add eager transformations if provided
      if (eager) {
        uploadOptions.eager = eager
      }

      const result = await cloudinary.uploader.upload(dataUrl, uploadOptions)

      // For private files, use our private file serving route
      let url = result.secure_url
      if (deliveryType !== 'upload') {
        url = `/api/files/serve/private/${result.public_id}?type=${resourceType}`
      }

      return {
        success: true,
        data: {
          publicId: result.public_id,
          filename: file.name,
          size: file.size,
          type: file.type,
          url: url,
          width: result.width,
          height: result.height,
          format: result.format,
          resourceType: result.resource_type,
          folder,
          provider: 'cloudinary',
          isPrivate: deliveryType !== 'upload'
        },
        message: 'File uploaded successfully'
      }

    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  }

  async uploadMultiple(files, options = {}) {
    const results = await Promise.all(
      files.map(file => this.uploadFile(file, options))
    )

    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    return {
      success: failed.length === 0,
      data: { uploaded: successful, failed, total: files.length },
      message: `${successful.length}/${files.length} files uploaded`
    }
  }

  async deleteFile(publicId, resourceType = 'image', deliveryType = 'private') {
    try {
      const type = deliveryType === 'upload' ? 'upload' : 'authenticated'
      
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: type
      })

      return {
        success: result.result === 'ok',
        message: result.result === 'ok' ? 'File deleted' : 'File not found'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  isConfigured() {
    return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  }
}

// Export singleton instance
export const cloudinaryUpload = new CloudinaryUploadService()
