'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  Bug, 
  FileText, 
  Calendar, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Trash2,
  User,
  Globe,
  Smartphone
} from 'lucide-react'
import { Button } from '@/main/components/ui/button'

const SUBMISSION_TYPES = {
  contact: { icon: Mail, label: 'Contact Forms', color: 'blue' },
  bug_report: { icon: Bug, label: 'Bug Reports', color: 'red' },
  feedback: { icon: FileText, label: 'Feedback', color: 'green' },
  email_subscription: { icon: Mail, label: 'Email Subscriptions', color: 'purple' },
  feature_request: { icon: FileText, label: 'Feature Requests', color: 'orange' },
  general: { icon: FileText, label: 'General Submissions', color: 'gray' }
}

const STATUS_COLORS = {
  pending: 'yellow',
  in_progress: 'blue', 
  resolved: 'green',
  closed: 'gray'
}

export default function AdminSubmissions() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/main/company/submissions', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/main/account/login?error=unauthorized&redirect=/admin/submissions')
          return
        }
        if (response.status === 403) {
          router.push('/main/account/login?error=insufficient_permissions&redirect=/admin/submissions')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setSubmissions(data.data?.submissions || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id, status) => {
    try {
      const response = await fetch('/api/main/company/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      
      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => sub.id === id ? { ...sub, status } : sub)
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesType = filter === 'all' || submission.type === filter
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getSubmissionCounts = () => {
    const counts = {}
    Object.keys(SUBMISSION_TYPES).forEach(type => {
      counts[type] = submissions.filter(sub => sub.type === type).length
    })
    counts.total = submissions.length
    return counts
  }

  const counts = getSubmissionCounts()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 flex items-center justify-center">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Submissions Admin</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-b from-black/95 via-blue-900/20 to-black/95 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total</p>
                <p className="text-3xl font-bold text-white">{counts.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          {Object.entries(SUBMISSION_TYPES).map(([type, config]) => {
            const IconComponent = config.icon
            const colorMap = {
              blue: 'blue-500/30',
              red: 'red-500/30', 
              green: 'green-500/30',
              purple: 'purple-500/30',
              orange: 'orange-500/30',
              gray: 'gray-500/30'
            }
            const shadowMap = {
              blue: 'blue-500/20',
              red: 'red-500/20',
              green: 'green-500/20',
              purple: 'purple-500/20',
              orange: 'orange-500/20',
              gray: 'gray-500/20'
            }
            return (
              <div key={type} className={`bg-gradient-to-b from-black/95 via-${config.color}-900/20 to-black/95 backdrop-blur-2xl border border-${colorMap[config.color]} rounded-2xl p-6 shadow-2xl shadow-${shadowMap[config.color]}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{config.label}</p>
                    <p className="text-3xl font-bold text-white">{counts[type]}</p>
                  </div>
                  <IconComponent className={`w-8 h-8 text-${config.color}-400`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-2xl shadow-purple-500/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Filters:</span>
            </div>
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="all">All Types</option>
              {Object.entries(SUBMISSION_TYPES).map(([type, config]) => (
                <option key={type} value={type}>{config.label}</option>
              ))}
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 flex-1"
              />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-gradient-to-b from-black/95 via-gray-900/20 to-black/95 backdrop-blur-2xl border border-gray-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-gray-500/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-semibold">Type</th>
                  <th className="text-left p-4 text-white font-semibold">From</th>
                  <th className="text-left p-4 text-white font-semibold">Subject/Message</th>
                  <th className="text-left p-4 text-white font-semibold">Status</th>
                  <th className="text-left p-4 text-white font-semibold">Date</th>
                  <th className="text-left p-4 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => {
                  const TypeIcon = SUBMISSION_TYPES[submission.type]?.icon || FileText
                  const typeConfig = SUBMISSION_TYPES[submission.type] || { color: 'gray', label: 'Unknown' }
                  
                  return (
                    <tr key={submission.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className={`w-5 h-5 text-${typeConfig.color}-400`} />
                          <span className="text-white/80 text-sm">{typeConfig.label}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-white font-medium">{submission.name || 'Anonymous'}</div>
                          <div className="text-white/60 text-sm">{submission.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white/80 max-w-xs truncate">
                          {submission.subject || submission.message || 'No message'}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={submission.status}
                          onChange={(e) => updateSubmissionStatus(submission.id, e.target.value)}
                          className={`bg-${STATUS_COLORS[submission.status]}-600/20 border border-${STATUS_COLORS[submission.status]}-400/30 rounded-lg px-3 py-1 text-${STATUS_COLORS[submission.status]}-300 text-sm [&>option]:bg-gray-800 [&>option]:text-white`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="text-white/60 text-sm">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button
                          onClick={() => setSelectedSubmission(submission)}
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No submissions found</p>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Submission Details</h2>
                <Button
                  onClick={() => setSelectedSubmission(null)}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-sm">Type</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {React.createElement(SUBMISSION_TYPES[selectedSubmission.type]?.icon || FileText, {
                        className: `w-5 h-5 text-${SUBMISSION_TYPES[selectedSubmission.type]?.color || 'gray'}-400`
                      })}
                      <span className="text-white">{SUBMISSION_TYPES[selectedSubmission.type]?.label || 'Unknown'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Status</label>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-lg text-sm bg-${STATUS_COLORS[selectedSubmission.status]}-600/20 text-${STATUS_COLORS[selectedSubmission.status]}-300`}>
                        {selectedSubmission.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-sm">From</label>
                  <div className="mt-1 text-white">
                    <div className="font-medium">{selectedSubmission.name || 'Anonymous'}</div>
                    <div className="text-white/70">{selectedSubmission.email}</div>
                  </div>
                </div>

                {selectedSubmission.subject && (
                  <div>
                    <label className="text-white/70 text-sm">Subject</label>
                    <div className="mt-1 text-white">{selectedSubmission.subject}</div>
                  </div>
                )}

                <div>
                  <label className="text-white/70 text-sm">Message</label>
                  <div className="mt-1 text-white bg-white/5 rounded-lg p-4 whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>

                {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                  <div>
                    <label className="text-white/70 text-sm">Attachments ({selectedSubmission.attachments.length})</label>
                    <div className="mt-2 space-y-3">
                      {selectedSubmission.attachments.map((attachment, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <span className="text-white font-medium">{attachment.filename}</span>
                            </div>
                            <div className="text-white/60 text-sm">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                          <div className="text-white/60 text-sm mb-3">
                            Type: {attachment.type}
                          </div>
                          {attachment.url && (
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => window.open(attachment.url, '_blank')}
                                variant="outline"
                                size="sm"
                                className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = attachment.url
                                  link.download = attachment.filename
                                  link.click()
                                }}
                                variant="outline"
                                size="sm"
                                className="bg-green-600/20 border-green-400/30 text-green-300 hover:bg-green-600/30"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.metadata && (
                  <div>
                    <label className="text-white/70 text-sm">Technical Details</label>
                    <div className="mt-1 bg-white/5 rounded-lg p-4">
                      <pre className="text-white/80 text-sm overflow-x-auto">
                        {(() => {
                          try {
                            // Handle if metadata is already an object
                            const metadataObj = typeof selectedSubmission.metadata === 'string' 
                              ? JSON.parse(selectedSubmission.metadata) 
                              : selectedSubmission.metadata
                            return JSON.stringify(metadataObj, null, 2)
                          } catch (error) {
                            return `Error parsing metadata: ${selectedSubmission.metadata}`
                          }
                        })()}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-white/70">Created</label>
                    <div className="text-white">{new Date(selectedSubmission.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-white/70">Updated</label>
                    <div className="text-white">{new Date(selectedSubmission.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
