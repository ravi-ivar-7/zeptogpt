const API_BASE = '/api/main/upload'

class UploadAPI {

  // Upload file
  async uploadFile(file, filename = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (filename) {
        formData.append('filename', filename)
      }

      const response = await fetch(API_BASE, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error during file upload:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Upload multiple files
  async uploadFiles(files, filenames = []) {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadFile(file, filenames[index] || null)
      )
      
      const results = await Promise.all(uploadPromises)
      
      const successfulUploads = results.filter(result => result.success)
      const failedUploads = results.filter(result => !result.success)
      
      return {
        success: failedUploads.length === 0,
        data: {
          successful: successfulUploads.map(result => result.data),
          failed: failedUploads.map(result => ({ error: result.error })),
          total: files.length,
          successCount: successfulUploads.length,
          failureCount: failedUploads.length
        },
        error: failedUploads.length > 0 ? `${failedUploads.length} uploads failed` : null,
        message: `${successfulUploads.length}/${files.length} files uploaded successfully`
      }
    } catch (error) {
      console.error('Error during multiple file upload:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null
      }
    }
  }

  // Upload image with validation
  async uploadImage(file, maxSize = 5 * 1024 * 1024) { // 5MB default
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          data: null,
          error: 'File must be an image',
          message: null,
          meta: { timestamp: new Date().toISOString() }
        }
      }

      // Validate file size
      if (file.size > maxSize) {
        return {
          success: false,
          data: null,
          error: `Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
          message: null,
          meta: { timestamp: new Date().toISOString() }
        }
      }

      return await this.uploadFile(file)
    } catch (error) {
      console.error('Error during image upload:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }
}

const uploadAPI = new UploadAPI()

export default uploadAPI
