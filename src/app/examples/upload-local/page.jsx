'use client'

import React, { useState } from 'react'
import { Upload, File, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react'
import { Button } from '@/main/components/ui/button'

export default function LocalUploadExample() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState([])
  const [intent, setIntent] = useState('example')

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
        formData.append('subDirectory', 'examples')
        formData.append('intent', intent)

        const response = await fetch('/api/upload/local', {
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

  const handleDelete = async (filename, directory = 'examples') => {
    try {
      const response = await fetch('/api/upload/local', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, directory })
      })

      const result = await response.json()
      
      if (result.success) {
        setUploadResults(prev => 
          prev.filter(item => item.data?.filename !== filename)
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
          <h1 className="text-4xl font-bold text-white mb-2">Local Upload Service</h1>
          <p className="text-white/70">Upload files to secure local server storage (private directory)</p>
        </div>

        {/* Upload Section */}
        <div className="bg-gradient-to-b from-black/95 via-blue-900/20 to-black/95 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-2xl shadow-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Files</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                File Intent/Purpose
              </label>
              <input
                type="text"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="e.g., profile_picture, document, report"
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm mb-4"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Select Files (Max 10MB each)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-white font-medium">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-blue-400" />
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
              disabled={files.length === 0 || uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload to Local Storage</span>
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
                          onClick={() => handleDelete(result.data.filename, result.data.directory)}
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
                          <span className="text-white/60">Directory:</span>
                          <span className="text-white ml-2">{result.data.directory}</span>
                        </div>
                        <div>
                          <span className="text-white/60">URL:</span>
                          <span className="text-blue-400 ml-2 break-all">{result.data.url}</span>
                        </div>
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
          <h2 className="text-2xl font-bold text-white mb-4">How Local Upload Works</h2>
          
          <div className="space-y-4 text-white/80">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-white">File Selection & Validation</h3>
                <p>Files are validated for size (max 10MB) and allowed types (images, videos, documents)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-white">User-Specific Naming</h3>
                <p>Files are named with pattern: <code className="bg-white/10 px-2 py-1 rounded">email_intent_timestamp_random.ext</code></p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-white">Secure Storage</h3>
                <p>Files stored in private <code className="bg-white/10 px-2 py-1 rounded">uploads/</code> directory (not publicly accessible)</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold text-white">Protected Access</h3>
                <p>Files served via authenticated endpoint <code className="bg-white/10 px-2 py-1 rounded">/api/files/serve</code> with ownership validation</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <h4 className="font-semibold text-green-400 mb-2">🔒 Security Features</h4>
              <ul className="space-y-1 text-sm text-green-300/80">
                <li>• Authentication required for all upload/delete operations</li>
                <li>• Files named with user email to prevent unauthorized access</li>
                <li>• Ownership validation on file access and deletion</li>
                <li>• Files stored outside public directory for security</li>
                <li>• Path traversal protection against malicious requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
