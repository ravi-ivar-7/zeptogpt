'use client'

import React, { useState, Suspense } from 'react';
import LoadingSpinner from '@/main/components/loaders/LoadingSpinner';
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader';
import InlineSpinner from '@/main/components/loaders/InlineSpinner';
import { Mail, Send, MessageCircle, AlertCircle, CheckCircle, X } from 'lucide-react';

const contactMethods = [
  {
    icon: <Mail className="w-8 h-8" />,
    title: "Email Us",
    description: "Get detailed support via email",
    contact: `contact@${(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/^https?:\/\//, '')}`,
    response: "Within 24 hours",
    gradient: "from-blue-600 to-cyan-600",
    action: `mailto:contact@${(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/^https?:\/\//, '')}`
  },
  // {
  //   icon: <MessageCircle className="w-8 h-8" />,
  //   title: "Live Chat",
  //   description: "Chat with our support team",
  //   contact: "Available 9 AM - 6 PM EST",
  //   response: "Instant response",
  //   gradient: "from-emerald-600 to-teal-600",
  //   action: "#chat"
  // }
];



function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal',
    type: 'feedback'
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // XSS sanitization function
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  // Client-side validation function
  const validateForm = () => {
    const errors = [];

    // Required fields validation
    if (!formData.name?.trim()) {
      errors.push('Name is required');
    }
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    }
    if (!formData.subject?.trim()) {
      errors.push('Subject is required');
    }
    if (!formData.message?.trim()) {
      errors.push('Message is required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      errors.push('Please enter a valid email address');
    }

    // Field length validation (both min and max)
    if (formData.name && formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (formData.name && formData.name.trim().length > 100) {
      errors.push('Name must be less than 100 characters');
    }
    
    if (formData.email && formData.email.trim().length > 255) {
      errors.push('Email must be less than 255 characters');
    }
    
    if (formData.subject && formData.subject.trim().length < 5) {
      errors.push('Subject must be at least 5 characters');
    }
    if (formData.subject && formData.subject.trim().length > 200) {
      errors.push('Subject must be less than 200 characters');
    }
    
    if (formData.message && formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (formData.message && formData.message.trim().length > 2000) {
      errors.push('Message must be less than 2000 characters');
    }

    // Priority validation (will be sanitized later)
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (formData.priority && !validPriorities.includes(formData.priority)) {
      // Don't error, just warn - we'll fix it during sanitization
      console.warn('Invalid priority, will be set to normal:', formData.priority);
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      // Client-side validation
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setFormError(validationErrors[0]);
        setIsSubmitting(false);
        return;
      }

      // Sanitize and clean all fields before sending
      const validPriorities = ['low', 'normal', 'high', 'urgent'];
      const cleanedFormData = {
        name: sanitizeInput(formData.name.trim()),
        email: sanitizeInput(formData.email.trim()),
        subject: sanitizeInput(formData.subject.trim()),
        message: sanitizeInput(formData.message.trim()),
        priority: validPriorities.includes(formData.priority) ? formData.priority : 'normal',
        type: formData.type
      };

      // Create FormData for submissions API
      const submissionFormData = new FormData();
      submissionFormData.append('type', cleanedFormData.type);
      submissionFormData.append('email', cleanedFormData.email);
      submissionFormData.append('name', cleanedFormData.name);
      submissionFormData.append('subject', cleanedFormData.subject);
      submissionFormData.append('message', cleanedFormData.message);
      submissionFormData.append('metadata', JSON.stringify({ priority: cleanedFormData.priority }));
      
      // Add files
      files.forEach(file => {
        submissionFormData.append('files', file);
      });

      const response = await fetch('/api/main/company/submissions', {
        method: 'POST',
        body: submissionFormData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success
      setFormSuccess(data.message || 'Message sent successfully! We\'ll get back to you soon.');
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'normal',
        type: 'feedback'
      });
      setFiles([]);

    } catch (error) {
      console.error('Contact form error:', error);
      setFormError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl border border-cyan-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-xs sm:text-sm">Get in Touch</span>
          </div>
          
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto">
            Have questions? Need help? Want to partner with us? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6">
            {formSuccess ? (
              /* Success Message */
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Message Sent Successfully!</h2>
                  <p className="text-white/70 text-base sm:text-lg mb-6">
                    {formSuccess}
                  </p>
                  <button
                    onClick={() => {
                      setFormSuccess('');
                      setFormError('');
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-sm"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-sm"
                  >
                    <option value="feedback" className="bg-gray-900">General Feedback</option>
                    <option value="bug_report" className="bg-gray-900">Bug Report</option>
                    <option value="feature_request" className="bg-gray-900">Feature Request</option>
                    <option value="general" className="bg-gray-900">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-sm"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-sm"
                  >
                    <option value="low" className="bg-gray-900">Low</option>
                    <option value="normal" className="bg-gray-900">Normal</option>
                    <option value="high" className="bg-gray-900">High</option>
                    <option value="urgent" className="bg-gray-900">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none text-sm"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1.5">
                  Attachments (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,text/plain,application/json"
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2.5 text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-sm"
                />
                <p className="text-white/50 text-xs mt-1">Max 10MB per file. Supports images, PDFs, text files.</p>
                
                {/* File Preview */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span className="text-white/80 text-sm truncate">{file.name}</span>
                          <span className="text-white/50 text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-3 sm:py-3.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <InlineSpinner color="white" text="Sending..." size="md" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {formError && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{formError}</span>
                </div>
              )}
            </form>
              </>
            )}
          </div>

          {/* Contact Methods */}
          <div className="space-y-3 sm:space-y-4">
            {contactMethods.map((method, index) => (
              <a 
                key={index} 
                href={method.action}
                className="group bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 text-center hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer block"
              >
                <div className={`bg-gradient-to-r ${method.gradient} p-3 rounded-xl inline-block mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7">
                    {method.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">{method.title}</h3>
                <p className="text-white/70 mb-2 leading-relaxed text-xs sm:text-sm">{method.description}</p>
                <div className="space-y-0.5">
                  <p className="text-cyan-400 font-semibold text-xs sm:text-sm">{method.contact}</p>
                  <p className="text-white/50 text-xs">{method.response}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<SkeletonLoader variant="form" count={5} />}>
      <ContactContent />
    </Suspense>
  )
}