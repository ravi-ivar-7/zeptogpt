'use client'

import React, { useState } from 'react'
import { Upload, File, CheckCircle, XCircle, Trash2, Eye, Cloud } from 'lucide-react'
import { Button } from '@/main/components/ui/button'

export default function CloudflareUploadExample() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState([])
  const [apiStatus, setApiStatus] = useState(null)

  React.useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/upload/cloudflare')
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

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    const results = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'examples')

        const response = await fetch('/api/upload/cloudflare', {
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

  const handleDelete = async (key, filename) => {
    try {
      const response = await fetch('/api/upload/cloudflare', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })

      const result = await response.json()
      
      if (result.success) {
        setUploadResults(prev => 
          prev.filter(item => item.data?.key !== key)
        )
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-orange-900/10 to-black/95 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cloudflare R2 Upload Service</h1>
          <p className="text-white/70">Upload files to Cloudflare R2 object storage</p>
        </div>

        {/* API Status */}
        {apiStatus && (
          <div className={`mb-6 p-4 rounded-xl border ${
            apiStatus.configured 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center space-x-3">
              <Cloud className={`w-5 h-5 ${apiStatus.configured ? 'text-green-400' : 'text-yellow-400'}`} />
              <div>
                <div className={`font-medium ${apiStatus.configured ? 'text-green-400' : 'text-yellow-400'}`}>
                  {apiStatus.configured ? 'Cloudflare R2 Configured' : 'Cloudflare R2 Not Configured'}
                </div>
                <div className="text-white/60 text-sm">
                  {apiStatus.configured 
                    ? 'Ready to upload files to R2 storage'
                    : 'Set CLOUDFLARE_R2_* environment variables to enable'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gradient-to-b from-black/95 via-orange-900/20 to-black/95 backdrop-blur-2xl border border-orange-500/30 rounded-2xl p-6 mb-8 shadow-2xl shadow-orange-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Files</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Select Files (Max 100MB each)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={!apiStatus?.configured}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 disabled:opacity-50"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white font-medium">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-orange-400" />
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
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading to R2...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload to Cloudflare R2</span>
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
                          onClick={() => handleDelete(result.data.key, result.data.filename)}
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
                          <span className="text-white/60">Type:</span>
                          <span className="text-white ml-2">{result.data.type}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Key:</span>
                          <span className="text-white ml-2 break-all">{result.data.key}</span>
                        </div>
                        <div>
                          <span className="text-white/60">ETag:</span>
                          <span className="text-white ml-2 break-all">{result.data.etag}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-white/60">URL:</span>
                        <span className="text-orange-400 ml-2 break-all">{result.data.url}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-8 bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">How Cloudflare R2 Works</h2>
          
          <div className="space-y-4 text-white/80">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-white">S3-Compatible API</h3>
                <p>Uses AWS SDK to communicate with Cloudflare R2 via S3-compatible endpoints</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-white">Global Edge Storage</h3>
                <p>Files stored on Cloudflare's global network for fast access worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-white">Cost Effective</h3>
                <p>No egress fees, pay only for storage and operations</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <h4 className="font-semibold text-orange-400 mb-2">🔧 Required Environment Variables</h4>
              <div className="space-y-1 text-sm text-orange-300/80 font-mono">
                <div>CLOUDFLARE_R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com</div>
                <div>CLOUDFLARE_R2_BUCKET=your-bucket-name</div>
                <div>CLOUDFLARE_R2_ACCESS_KEY=your-access-key</div>
                <div>CLOUDFLARE_R2_SECRET_KEY=your-secret-key</div>
                <div>CLOUDFLARE_R2_PUBLIC_URL=https://your-domain.com (optional)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
