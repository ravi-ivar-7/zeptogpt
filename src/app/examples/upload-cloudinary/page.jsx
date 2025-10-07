'use client'

import React, { useState } from 'react'
import { Upload, File, CheckCircle, XCircle, Trash2, Eye, Image, Video, Music, FileText } from 'lucide-react'
import { Button } from '@/main/components/ui/button'

export default function CloudinaryUploadExample() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState([])
  const [apiStatus, setApiStatus] = useState(null)
  const [uploadOptions, setUploadOptions] = useState({
    folder: 'examples',
    tags: '',
    transformation: '',
    deliveryType: 'authenticated'
  })

  React.useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/upload/cloudinary')
      const data = await response.json()
      setApiStatus(data)
    } catch (error) {
      setApiStatus({ success: false, configured: false })
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
    setUploadResults([])
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-400" />
    if (type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-400" />
    if (type.startsWith('audio/')) return <Music className="w-5 h-5 text-green-400" />
    return <FileText className="w-5 h-5 text-orange-400" />
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    const results = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', uploadOptions.folder)
        
        if (uploadOptions.tags) {
          formData.append('tags', uploadOptions.tags)
        }
        
        if (uploadOptions.transformation) {
          formData.append('transformation', uploadOptions.transformation)
        }
        
        if (uploadOptions.deliveryType) {
          formData.append('deliveryType', uploadOptions.deliveryType)
        }

        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()
        results.push({ file: file.name, ...result })

      } catch (error) {
        results.push({
          file: file.name,
          success: false,
          error: error.message
        })
      }
    }

    setUploadResults(results)
    setUploading(false)
  }

  const handleDelete = async (publicId, resourceType = 'image') => {
    try {
      const response = await fetch('/api/upload/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, resourceType })
      })

      const result = await response.json()
      
      if (result.success) {
        setUploadResults(prev => 
          prev.filter(item => item.data?.publicId !== publicId)
        )
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-blue-900/10 to-black/95 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cloudinary Upload Service</h1>
          <p className="text-white/70">Upload and transform media files with Cloudinary</p>
        </div>

        {/* API Status */}
        {apiStatus && (
          <div className={`mb-6 p-4 rounded-xl border ${
            apiStatus.configured 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center space-x-3">
              <Image className={`w-5 h-5 ${apiStatus.configured ? 'text-green-400' : 'text-yellow-400'}`} />
              <div>
                <div className={`font-medium ${apiStatus.configured ? 'text-green-400' : 'text-yellow-400'}`}>
                  {apiStatus.configured ? 'Cloudinary Configured' : 'Cloudinary Not Configured'}
                </div>
                <div className="text-white/60 text-sm">
                  {apiStatus.configured 
                    ? 'Ready to upload and transform media files'
                    : 'Set CLOUDINARY_* environment variables to enable'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Options */}
        <div className="bg-gradient-to-b from-black/95 via-blue-900/20 to-black/95 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-6 mb-6 shadow-2xl shadow-blue-500/20">
          <h2 className="text-xl font-bold text-white mb-4">Upload Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Folder</label>
              <input
                type="text"
                value={uploadOptions.folder}
                onChange={(e) => setUploadOptions(prev => ({ ...prev, folder: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
                placeholder="examples"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={uploadOptions.tags}
                onChange={(e) => setUploadOptions(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
                placeholder="demo,upload,test"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Transformation (JSON)</label>
              <input
                type="text"
                value={uploadOptions.transformation}
                onChange={(e) => setUploadOptions(prev => ({ ...prev, transformation: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
                placeholder='{"width":300,"height":200}'
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Delivery Type</label>
              <select
                value={uploadOptions.deliveryType}
                onChange={(e) => setUploadOptions(prev => ({ ...prev, deliveryType: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="upload">Upload (Public)</option>
                <option value="private">Private</option>
                <option value="authenticated">Authenticated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-gradient-to-b from-black/95 via-blue-900/20 to-black/95 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-2xl shadow-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Files</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Select Files (Images, Videos, Audio, PDFs - Max 100MB each)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf"
                onChange={handleFileSelect}
                disabled={!apiStatus?.configured}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 disabled:opacity-50"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white font-medium">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="text-white text-sm">{file.name}</div>
                        <div className="text-white/60 text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading || !apiStatus?.configured}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading to Cloudinary...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload to Cloudinary</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {uploadResults.length > 0 && (
          <div className="bg-gradient-to-b from-black/95 via-green-900/20 to-black/95 backdrop-blur-2xl border border-green-500/30 rounded-2xl p-6 shadow-2xl shadow-green-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Upload Results</h2>
            
            <div className="space-y-3">
              {uploadResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      
                      <div>
                        <div className="text-white font-medium">{result.file}</div>
                        {result.success ? (
                          <div className="text-green-400 text-sm">{result.message}</div>
                        ) : (
                          <div className="text-red-400 text-sm">{result.error}</div>
                        )}
                      </div>
                    </div>

                    {result.success && result.data && (
                      <div className="flex items-center space-x-2">
                        <a
                          href={result.data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </a>
                        <button
                          onClick={() => handleDelete(result.data.publicId, result.data.resourceType)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {result.success && result.data && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Size:</span>
                          <span className="text-white ml-2">{(result.data.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <div>
                          <span className="text-white/60">Format:</span>
                          <span className="text-white ml-2">{result.data.format}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Resource Type:</span>
                          <span className="text-white ml-2">{result.data.resourceType}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Version:</span>
                          <span className="text-white ml-2">{result.data.version}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-white/60">Public ID:</span>
                        <span className="text-blue-400 ml-2 break-all">{result.data.publicId}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-white/60">URL:</span>
                        <span className="text-blue-400 ml-2 break-all">{result.data.url}</span>
                      </div>
                      {result.data.transformedUrl && (
                        <div className="mt-1">
                          <span className="text-white/60">Transformed URL:</span>
                          <span className="text-purple-400 ml-2 break-all">{result.data.transformedUrl}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-8 bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">How Cloudinary Works</h2>
          
          <div className="space-y-4 text-white/80">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-white">Media Management</h3>
                <p>Upload, store, and manage images, videos, and other media files in the cloud</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-white">On-the-Fly Transformations</h3>
                <p>Resize, crop, optimize, and apply effects to media files via URL parameters</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-white">Global CDN</h3>
                <p>Fast delivery worldwide with automatic optimization for different devices</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold text-white">AI-Powered Features</h3>
                <p>Auto-tagging, content analysis, and smart cropping with machine learning</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h4 className="font-semibold text-blue-400 mb-2">🔧 Required Environment Variables</h4>
              <div className="space-y-1 text-sm text-blue-300/80 font-mono">
                <div>CLOUDINARY_CLOUD_NAME=your-cloud-name</div>
                <div>CLOUDINARY_API_KEY=your-api-key</div>
                <div>CLOUDINARY_API_SECRET=your-api-secret</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <h4 className="font-semibold text-purple-400 mb-2">🎨 Transformation Examples</h4>
              <div className="space-y-1 text-sm text-purple-300/80 font-mono">
                <div>{`{"width":300,"height":200}`} - Resize to 300x200</div>
                <div>{`{"crop":"fill","gravity":"face"}`} - Crop and focus on faces</div>
                <div>{`{"quality":"auto","format":"auto"}`} - Auto optimize</div>
                <div>{`{"effect":"blur:300"}`} - Apply blur effect</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
