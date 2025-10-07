'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  variant?: 'canvas' | 'list' | 'card' | 'form' | 'table' | 'custom'
  count?: number
  className?: string
  animate?: boolean
}

const shimmer = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
  transition: {
    repeat: Infinity,
    duration: 1.5,
    ease: 'linear' as const
  }
}

const SkeletonBox = ({ className = '', animate = true }: { className?: string, animate?: boolean }) => (
  <div className={`bg-gray-700/50 rounded overflow-hidden relative ${className}`}>
    {animate && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"
        {...shimmer}
      />
    )}
  </div>
)

export default function SkeletonLoader({ 
  variant = 'card', 
  count = 1, 
  className = '',
  animate = true 
}: SkeletonLoaderProps) {
  
  const renderCanvasSkeleton = () => (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <div className="hidden md:block w-64 bg-gray-800/50 p-4 space-y-4">
        <SkeletonBox className="h-8 w-32" animate={animate} />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonBox key={i} className="h-6 w-full" animate={animate} />
          ))}
        </div>
      </div>
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas - responsive grid */}
        <div className="flex-1 bg-gray-900/50 p-3 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(count || 8)].map((_, i) => (
              <div key={i} className="bg-gray-800/40 rounded-lg p-3 space-y-2">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <SkeletonBox className="h-3 w-12" animate={animate} />
                  <SkeletonBox className="h-2 w-2 rounded-full" animate={animate} />
                </div>
                {/* Card content */}
                <SkeletonBox className="h-8 w-full rounded" animate={animate} />
                <div className="space-y-1">
                  <SkeletonBox className="h-2 w-full" animate={animate} />
                  <SkeletonBox className="h-2 w-3/4" animate={animate} />
                </div>
                {/* Card footer */}
                <div className="flex gap-1 pt-1">
                  <SkeletonBox className="h-4 w-8 rounded" animate={animate} />
                  <SkeletonBox className="h-4 w-6 rounded" animate={animate} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderListSkeleton = () => (
    <div className="space-y-3">
      {/* List header */}
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="h-7 w-32" animate={animate} />
        <SkeletonBox className="h-9 w-24 rounded-lg" animate={animate} />
      </div>
      
      {/* List items */}
      {[...Array(count || 5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
          <SkeletonBox className="h-10 w-10 rounded-full flex-shrink-0" animate={animate} />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-3/4" animate={animate} />
            <SkeletonBox className="h-3 w-1/2 opacity-70" animate={animate} />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-6 w-16 rounded-full" animate={animate} />
            <SkeletonBox className="h-8 w-8 rounded" animate={animate} />
          </div>
        </div>
      ))}
    </div>
  )

  const renderCardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-800/30 rounded-lg p-6 space-y-4">
          <SkeletonBox className="h-6 w-3/4" animate={animate} />
          <SkeletonBox className="h-32 w-full rounded" animate={animate} />
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-full" animate={animate} />
            <SkeletonBox className="h-4 w-2/3" animate={animate} />
          </div>
          <div className="flex gap-2">
            <SkeletonBox className="h-8 w-16 rounded" animate={animate} />
            <SkeletonBox className="h-8 w-16 rounded" animate={animate} />
          </div>
        </div>
      ))}
    </div>
  )

  const renderFormSkeleton = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg w-full mx-auto bg-gray-800/20 rounded-xl p-8 border border-gray-700/30">
      {/* Form header */}
      <div className="text-center mb-8">
        <SkeletonBox className="h-8 w-48 mx-auto mb-2" animate={animate} />
        <SkeletonBox className="h-4 w-64 mx-auto opacity-70" animate={animate} />
      </div>
      
      {/* Form fields */}
      <div className="space-y-6">
        {[...Array(count || 4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBox className="h-4 w-20" animate={animate} />
            <SkeletonBox className="h-12 w-full rounded-lg border border-gray-600/30" animate={animate} />
            {i === 1 && <SkeletonBox className="h-3 w-32 opacity-60" animate={animate} />}
          </div>
        ))}
        
        {/* Checkbox/toggle */}
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-4 w-4 rounded" animate={animate} />
          <SkeletonBox className="h-4 w-40" animate={animate} />
        </div>
        
        {/* Submit button */}
        <SkeletonBox className="h-12 w-full rounded-lg mt-8" animate={animate} />
        
        {/* Footer links */}
        <div className="flex justify-center gap-4 mt-6">
          <SkeletonBox className="h-4 w-24" animate={animate} />
          <SkeletonBox className="h-4 w-20" animate={animate} />
        </div>
      </div>
    </div>
    </div>
  )

  const renderTableSkeleton = () => (
    <div className="bg-gray-800/20 rounded-xl border border-gray-700/30 overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-800/40 border-b border-gray-700/50">
        <div className="grid grid-cols-5 gap-4 p-4">
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-4 w-4 rounded" animate={animate} />
            <SkeletonBox className="h-4 w-16" animate={animate} />
          </div>
          <SkeletonBox className="h-4 w-20" animate={animate} />
          <SkeletonBox className="h-4 w-24" animate={animate} />
          <SkeletonBox className="h-4 w-18" animate={animate} />
          <SkeletonBox className="h-4 w-16" animate={animate} />
        </div>
      </div>
      
      {/* Table rows */}
      <div className="divide-y divide-gray-700/30">
        {[...Array(count || 5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-800/10">
            <div className="flex items-center gap-3">
              <SkeletonBox className="h-4 w-4 rounded" animate={animate} />
              <SkeletonBox className="h-8 w-8 rounded-full" animate={animate} />
              <SkeletonBox className="h-4 w-24" animate={animate} />
            </div>
            <SkeletonBox className="h-4 w-32" animate={animate} />
            <div className="flex items-center gap-2">
              <SkeletonBox className="h-6 w-16 rounded-full" animate={animate} />
            </div>
            <SkeletonBox className="h-4 w-20 opacity-70" animate={animate} />
            <div className="flex items-center gap-2">
              <SkeletonBox className="h-6 w-6 rounded" animate={animate} />
              <SkeletonBox className="h-6 w-6 rounded" animate={animate} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Table footer */}
      <div className="bg-gray-800/20 border-t border-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-4 w-32" animate={animate} />
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-8 w-8 rounded" animate={animate} />
            <SkeletonBox className="h-8 w-8 rounded" animate={animate} />
            <SkeletonBox className="h-8 w-8 rounded" animate={animate} />
          </div>
        </div>
      </div>
    </div>
  )

  const skeletonVariants = {
    canvas: renderCanvasSkeleton,
    list: renderListSkeleton,
    card: renderCardSkeleton,
    form: renderFormSkeleton,
    table: renderTableSkeleton,
    custom: () => <SkeletonBox className={className} animate={animate} />
  }

  return (
    <div className={`${className} min-h-screen pb-6 md:pt-6 `}>
      {skeletonVariants[variant]()}
    </div>
  )
}
