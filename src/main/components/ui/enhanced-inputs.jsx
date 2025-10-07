import { useState, useRef, useCallback } from 'react'
import { Input } from './input'
import { Textarea } from './textarea'
import { Button } from './button'
import { Badge } from './badge'
import { Progress } from './progress'
import { Upload, X, File, Link, Code, Hash } from 'lucide-react'
import { mediaUploader } from '../../services/upload/mediaUpload'
// INPUT_TYPES removed - writeflow functionality disabled

// Enhanced input component that handles all input types
export function EnhancedInput({ type, value, onChange, label, placeholder, required, ...props }) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [tags, setTags] = useState(Array.isArray(value) ? value : [])
  const [tagInput, setTagInput] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = useCallback(async (file) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Validate file based on input type
      let allowedTypes = []
      let maxSize = 10 * 1024 * 1024 // 10MB default

      if (type === INPUT_TYPES.IMAGE) {
        allowedTypes = ['image/']
        maxSize = 5 * 1024 * 1024 // 5MB for images
      } else if (type === INPUT_TYPES.VIDEO) {
        allowedTypes = ['video/']
        maxSize = 50 * 1024 * 1024 // 50MB for videos
      }

      const validation = mediaUploader.validateFile(file, allowedTypes, maxSize)
      if (!validation.isValid) {
        alert(validation.errors.join('\n'))
        return
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const result = await mediaUploader.uploadFile(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        onChange(result.url)
        setTimeout(() => {
          setUploadProgress(0)
          setIsUploading(false)
        }, 500)
      } else {
        alert(`Upload failed: ${result.error}`)
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [type, onChange])

  const handleTagAdd = useCallback((tag) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag]
      setTags(newTags)
      onChange(newTags)
      setTagInput('')
    }
  }, [tags, onChange])

  const handleTagRemove = useCallback((tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    onChange(newTags)
  }, [tags, onChange])

  const renderInput = () => {
    switch (type) {
      case INPUT_TYPES.TEXT:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        )

      case INPUT_TYPES.TEXTAREA:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={3}
            {...props}
          />
        )

      case INPUT_TYPES.NUMBER:
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        )

      case INPUT_TYPES.BOOLEAN:
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-gray-300"
              {...props}
            />
            <span className="text-sm">{label}</span>
          </div>
        )

      case INPUT_TYPES.COLOR:
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
              {...props}
            />
            <Input
              type="text"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        )

      case INPUT_TYPES.IMAGE:
      case INPUT_TYPES.VIDEO:
      case INPUT_TYPES.FILE:
        return (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={type === INPUT_TYPES.IMAGE ? 'image/*' : type === INPUT_TYPES.VIDEO ? 'video/*' : '*/*'}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="hidden"
            />

            {!value && !isUploading && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {type === INPUT_TYPES.IMAGE ? 'Image' : type === INPUT_TYPES.VIDEO ? 'Video' : 'File'}
              </Button>
            )}

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {value && !isUploading && (
              <div className="space-y-2">
                {type === INPUT_TYPES.IMAGE && (
                  <div className="relative">
                    <img src={value} alt="Uploaded" className="w-full h-32 object-cover rounded border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onChange('')}
                      className="absolute top-1 right-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {type === INPUT_TYPES.VIDEO && (
                  <div className="relative">
                    <video src={value} className="w-full h-32 object-cover rounded border" controls />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onChange('')}
                      className="absolute top-1 right-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {type === INPUT_TYPES.FILE && (
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <File className="w-4 h-4" />
                      <span className="text-sm truncate">{value.split('/').pop()}</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onChange('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case INPUT_TYPES.URL:
        return (
          <div className="flex items-center space-x-2">
            <Link className="w-4 h-4 text-muted-foreground" />
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com"
              required={required}
              className="flex-1"
              {...props}
            />
          </div>
        )

      case INPUT_TYPES.CODE:
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Code className="w-4 h-4" />
              <span>Code Editor</span>
            </div>
            <Textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="// Enter your code here..."
              required={required}
              rows={6}
              className="font-mono text-sm"
              {...props}
            />
          </div>
        )

      case INPUT_TYPES.JSON:
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Hash className="w-4 h-4" />
              <span>JSON Editor</span>
            </div>
            <Textarea
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  onChange(parsed)
                } catch {
                  onChange(e.target.value)
                }
              }}
              placeholder='{\n  "key": "value"\n}'
              required={required}
              rows={6}
              className="font-mono text-sm"
              {...props}
            />
          </div>
        )

      case INPUT_TYPES.TAG:
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 h-auto p-0 text-xs"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleTagAdd(tagInput.trim())
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleTagAdd(tagInput.trim())}
              >
                Add
              </Button>
            </div>
          </div>
        )

      case INPUT_TYPES.DATE:
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );

      case INPUT_TYPES.TIME:
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );

      case INPUT_TYPES.DATETIME_LOCAL:
        return (
          <Input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );

      case INPUT_TYPES.RANGE:
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={props.min || 0}
              max={props.max || 100}
              step={props.step || 1}
              value={value || 50}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{props.min || 0}</span>
              <span>{value || 50}</span>
              <span>{props.max || 100}</span>
            </div>
          </div>
        );

      case INPUT_TYPES.SELECT:
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded text-sm bg-background"
          >
            <option value="">Select an option</option>
            {props.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case INPUT_TYPES.RICHTEXT:
        return (
          <>
          <p>Coming soon</p></>
        )

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        )
    }
  }

  return (
    <div className="space-y-1">
      {renderInput()}
    </div>
  )
}
