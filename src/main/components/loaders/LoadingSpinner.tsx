'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gradient' | 'rainbow';
  text?: string;
  fullScreen?: boolean;
  overlayOpacity?: number;
  blur?: boolean;
  animationType?: 'pulse' | 'rotate' | 'wave' | 'orbit' | 'particles' | 'ripple';
  showProgress?: boolean;
  tips?: string[];
}

const colorClasses = {
  primary: 'bg-indigo-500',
  secondary: 'bg-pink-500',
  white: 'bg-white',
  gradient: 'bg-gradient-to-r from-indigo-500 to-pink-500',
  rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'gradient',
  text = 'Loading...',
  fullScreen = false,
  overlayOpacity = 0.85,
  blur = true,
  animationType = 'particles',
  showProgress = true,
  tips = [
    "Almost there... good things come to those who wait",
  ],
}: LoadingSpinnerProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-6 w-6',
  };

  const containerSize = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
  };

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Rotate through tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(tipInterval);
  }, [tips.length]);

  const renderAnimation = () => {
    switch (animationType) {
      case 'pulse':
        return (
          <div className="flex space-x-2">
            {[0, 0.2, 0.4].map((delay) => (
              <motion.div
                key={delay}
                className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: delay,
                }}
              />
            ))}
          </div>
        );
      case 'rotate':
        return (
          <motion.div
            className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      case 'wave':
        return (
          <div className="flex items-end space-x-1 h-8">
            {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
              <motion.div
                key={i}
                className={`rounded-sm ${colorClasses[color]}`}
                style={{ width: sizeClasses[size].split(' ')[1] }}
                animate={{
                  height: ['40%', '100%', '40%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: delay,
                }}
              />
            ))}
          </div>
        );
      case 'orbit':
        return (
          <motion.div
            className={`relative ${containerSize[size]} ${containerSize[size]}`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <motion.div
              className={`absolute top-0 left-1/2 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
              style={{ x: '-50%' }}
            />
            <motion.div
              className={`absolute top-1/2 right-0 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
              style={{ y: '-50%' }}
            />
            <motion.div
              className={`absolute bottom-0 left-1/2 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
              style={{ x: '-50%' }}
            />
            <motion.div
              className={`absolute top-1/2 left-0 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
              style={{ y: '-50%' }}
            />
          </motion.div>
        );
      case 'particles':
        return (
          <div className="relative w-20 h-20 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                animate={{
                  x: [0, Math.sin(i * 45 * (Math.PI / 180)) * 30, 0],
                  y: [0, Math.cos(i * 45 * (Math.PI / 180)) * 30, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );
      case 'ripple':
        return (
          <div className="relative flex items-center justify-center">
            <motion.div
              className={`absolute rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
              animate={{
                scale: [1, 2, 2.5, 1],
                opacity: [1, 0.8, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className={`absolute rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
              animate={{
                scale: [1, 1.5, 2, 1],
                opacity: [1, 0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
              }}
            />
            <div className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`} />
          </div>
        );
      default:
        return null;
    }
  };

  const loaderContent = (
    <motion.div 
      className="flex flex-col items-center justify-center space-y-6 p-8 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {renderAnimation()}
        {showProgress && (
          <motion.div 
            className="absolute -bottom-6 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={`h-full ${colorClasses[color]}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </div>

      <div className="text-center space-y-4 max-w-md">
        {text && (
          <motion.p
            className={`text-lg font-medium ${
              color === 'white' ? 'text-white' : 'text-gray-200'
            }`}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            {text}
          </motion.p>
        )}

        {tips && (
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-400 italic"
          >
            {tips[currentTip]}
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          blur ? 'backdrop-blur-md' : ''
        }`}
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {loaderContent}
      </motion.div>
    );
  }

  return loaderContent;
}
